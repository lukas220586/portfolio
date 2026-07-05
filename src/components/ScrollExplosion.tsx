import { useEffect, useRef } from 'react'

// ── 3D math ──
const M = {
  rx: (a: number) => { const c=Math.cos(a),s=Math.sin(a); return [1,0,0,0,c,s,0,-s,c] },
  ry: (a: number) => { const c=Math.cos(a),s=Math.sin(a); return [c,0,-s,0,1,0,s,0,c] },
  rz: (a: number) => { const c=Math.cos(a),s=Math.sin(a); return [c,s,0,-s,c,0,0,0,1] },
  mul: (m: number[], v: number[]) => [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]],
}

function t3(v: number[], rx: number, ry: number, rz: number, tx=0, ty=0, tz=0): number[] {
  let p=M.mul(M.rz(rz), v); p=M.mul(M.rx(rx), p); p=M.mul(M.ry(ry), p)
  return [p[0]+tx, p[1]+ty, p[2]+tz]
}

function proj(x: number, y: number, z: number, W: number, H: number, fov=600) {
  const d=fov+z; if (d<1) return {x:W/2,y:H/2,s:0}
  const s=fov/d; return {x:x*s+W/2, y:y*s+H/2, s}
}

// ── particles ──
interface Particle {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  life: number; maxLife: number
  size: number; color: string
  glow: number
}

function rand(min: number, max: number) { return min + Math.random() * (max - min) }

const PARTICLE_COLORS = ['#7c3aed','#3b82f6','#06b6d4','#ec4899','#f59e0b','#10b981','#ffffff']

// ── PCB components ──
interface CompDef {
  pos: [number,number,number]; rot: [number,number,number]
  size: [number,number,number]; color: string; glow: number
  group: number; label?: string
}

const compDefs: CompDef[] = [
  { pos:[0,0,0.5], rot:[0,0,0], size:[3.2,3.2,0.3], color:'#7c3aed', glow:0.9, group:0, label:'CPU' },
  { pos:[-4,-3,0.4], rot:[0,0.1,0], size:[2.8,2.8,0.25], color:'#8b5cf6', glow:0.6, group:0, label:'GPU' },
  { pos:[4.5,-1.5,0.3], rot:[0,0,0], size:[0.6,2.4,0.2], color:'#6366f1', glow:0.5, group:1 },
  { pos:[4.5,1.5,0.3], rot:[0,0,0], size:[0.6,2.4,0.2], color:'#6366f1', glow:0.5, group:1 },
  { pos:[-2,4,0.2], rot:[0,0,0], size:[0.5,0.5,0.4], color:'#06b6d4', glow:0.4, group:2 },
  { pos:[-1,4.2,0.2], rot:[0,0,0], size:[0.5,0.5,0.4], color:'#06b6d4', glow:0.4, group:2 },
  { pos:[0,4.3,0.2], rot:[0,0,0], size:[0.5,0.5,0.4], color:'#06b6d4', glow:0.4, group:2 },
  { pos:[1,4.2,0.2], rot:[0,0,0], size:[0.5,0.5,0.4], color:'#06b6d4', glow:0.4, group:2 },
  { pos:[2,4,0.2], rot:[0,0,0], size:[0.5,0.5,0.4], color:'#06b6d4', glow:0.4, group:2 },
  { pos:[-5.5,0,0.2], rot:[0,0,0], size:[0.4,3,0.3], color:'#3b82f6', glow:0.6, group:3 },
  { pos:[5.5,0,0.2], rot:[0,0,0], size:[0.4,3,0.3], color:'#3b82f6', glow:0.6, group:3 },
  { pos:[-3.5,3.5,0.1], rot:[0,0,0.2], size:[0.3,0.6,0.15], color:'#ec4899', glow:0.3, group:4 },
  { pos:[-2.5,3.8,0.1], rot:[0,0,-0.1], size:[0.3,0.6,0.15], color:'#ec4899', glow:0.3, group:4 },
  { pos:[3.5,3.5,0.1], rot:[0,0,0.15], size:[0.3,0.6,0.15], color:'#f59e0b', glow:0.3, group:4 },
  { pos:[2.5,3.8,0.1], rot:[0,0,-0.1], size:[0.3,0.6,0.15], color:'#f59e0b', glow:0.3, group:4 },
  { pos:[-4.5,-3.5,0.2], rot:[0,0,0.5], size:[1.2,1.2,0.2], color:'#14b8a6', glow:0.4, group:5 },
  { pos:[4,-3.5,0.2], rot:[0,0,-0.3], size:[1.8,0.8,0.2], color:'#10b981', glow:0.4, group:5 },
  { pos:[-5,3,0.2], rot:[0,0,0], size:[0.6,0.8,0.2], color:'#f59e0b', glow:0.4, group:6 },
  { pos:[-5,2,0.2], rot:[0,0,0], size:[0.6,0.8,0.2], color:'#f59e0b', glow:0.4, group:6 },
  { pos:[-5.5,-2,0.2], rot:[0,0,0], size:[0.6,0.8,0.2], color:'#f59e0b', glow:0.4, group:6 },
  { pos:[-5.5,-3,0.2], rot:[0,0,0], size:[0.6,0.8,0.2], color:'#f59e0b', glow:0.4, group:6 },
]

const tracePaths: [number,number,number][][] = [
  [[-4,-3,0],[-2,-3,0],[0,-2,0]],
  [[4.5,-1.5,0],[2,-1,0],[0,-1,0]],
  [[4.5,1.5,0],[2,1,0],[0,1,0]],
  [[-2,4,0],[-1,2,0],[0,1,0]],
  [[-5.5,0,0],[-4,0,0],[-3,0,0]],
  [[5.5,0,0],[4,0,0],[3,0,0]],
  [[-3.5,3.5,0],[-2,3,0],[-1,2,0],[0,1,0]],
  [[4,-3.5,0],[3,-2.5,0],[2,-2,0],[0,-1.5,0]],
  [[-5,3,0],[-4,2,0],[-3,1,0]],
  [[-5,2,0],[-4,1.5,0],[-3,1,0]],
]

function makeBox(sx:number,sy:number,sz:number): number[][] {
  const hx=sx/2, hy=sy/2, hz=sz/2
  return [[-hx,-hy,-hz],[hx,-hy,-hz],[hx,hy,-hz],[-hx,hy,-hz],[-hx,-hy,hz],[hx,-hy,hz],[hx,hy,hz],[-hx,hy,hz]]
}

const facesIdx = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]]

// ── phases ──
const PHASES = [
  { start: 0.00, label: 'PCB INTACT',  sub: 'System ready' },
  { start: 0.15, label: 'THERMAL STRESS', sub: 'Overheating detected' },
  { start: 0.30, label: 'STRUCTURAL FAILURE', sub: 'Cascade failure imminent' },
  { start: 0.45, label: 'CATASTROPHIC DISASSEMBLY', sub: 'Hardware explosion' },
  { start: 0.65, label: 'DEBRIS FIELD', sub: 'Component analysis' },
  { start: 0.85, label: 'REASSEMBLY', sub: 'System restore' },
]

export default function ScrollExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pRef = useRef(0) // scroll progress 0-1
  const tRef = useRef(0)  // time

  useEffect(() => {
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    let animId: number
    const mouse = { x:0, y:0 }
    let particles: Particle[] = []
    let flashAlpha = 0
    let sparkDelay = 0

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / c.width - 0.5) * 2
      mouse.y = (e.clientY / c.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const onScroll = () => {
      const rect = c.getBoundingClientRect()
      const vh = window.innerHeight
      // progress 0-1 while this section is in view
      const offset = -rect.top / vh
      pRef.current = Math.max(0, Math.min(1, offset))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── burst particles at explosion ──
    function burstParticles(cx: number, cy: number, cz: number, count: number, spread: number) {
      for (let i = 0; i < count; i++) {
        const theta = rand(0, Math.PI * 2)
        const phi = rand(-Math.PI / 2, Math.PI / 2)
        const speed = rand(2, 12)
        particles.push({
          x: cx + rand(-0.5, 0.5), y: cy + rand(-0.5, 0.5), z: cz + rand(-0.5, 0.5),
          vx: Math.cos(theta) * Math.cos(phi) * speed,
          vy: Math.sin(theta) * Math.cos(phi) * speed,
          vz: Math.sin(phi) * speed,
          life: 1, maxLife: rand(60, 200),
          size: rand(0.3, 2.5), color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          glow: rand(0.3, 1),
        })
      }
    }

    // ── sparks along traces ──
    function addSparks(cx: number, cy: number, cz: number, count: number) {
      for (let i = 0; i < count; i++) {
        const theta = rand(0, Math.PI * 2)
        const speed = rand(1, 5)
        particles.push({
          x: cx, y: cy, z: cz,
          vx: Math.cos(theta) * speed, vy: Math.sin(theta) * speed, vz: rand(-2, 2),
          life: 1, maxLife: rand(10, 30),
          size: rand(0.1, 0.8), color: '#ff6b35',
          glow: 1,
        })
      }
    }

    function getPhase(p: number) {
      let idx = 0
      for (let i = PHASES.length - 1; i >= 0; i--) {
        if (p >= PHASES[i].start) { idx = i; break }
      }
      return { ...PHASES[idx], index: idx, localProgress: (p - PHASES[idx].start) / ((PHASES[idx+1]?.start ?? 1) - PHASES[idx].start) }
    }

    // ── main draw ──
    function draw() {
      const W=c.width, H=c.height, CX=W/2, CY=H/2
      const progress = pRef.current
      tRef.current++
      const phase = getPhase(progress)
      const pLocal = Math.min(1, phase.localProgress)

      ctx.clearRect(0, 0, W, H)

      // ── camera ──
      const camDist = 500 + progress * 300 - (progress > 0.85 ? (progress - 0.85) * 400 : 0)
      const rx = 0.35 + Math.sin(tRef.current / 6000) * 0.1 + mouse.y * 0.08
      const ry = tRef.current / 10000 + mouse.x * 0.15

      const tf = (v: number[], dx=0, dy=0, dz=0) => {
        let p = M.mul(M.rx(rx), v); p = M.mul(M.ry(ry), p)
        return [p[0]+dx, p[1]+dy, p[2]+dz]
      }

      const pr = (x: number, y: number, z: number) => proj(x, y, z, CX, CY, camDist)

      const boardScale = 6
      const boardW = 7.5 * boardScale, boardH = 5.5 * boardScale, boardD = 0.3 * boardScale

      // ── phase-specific params ──
      const heatIntensity = Math.max(0, Math.min(1, (progress - 0.15) / 0.15))
      const crackIntensity = Math.max(0, Math.min(1, (progress - 0.3) / 0.15))
      const explosionIntensity = Math.max(0, Math.min(1, (progress - 0.45) / 0.2))
      const debrisIntensity = Math.max(0, Math.min(1, (progress - 0.65) / 0.2))
      const reassemblyIntensity = Math.max(0, Math.min(1, (progress - 0.85) / 0.15))

      // ── explosion burst ──
      if (progress > 0.45 && progress < 0.48 && sparkDelay === 0) {
        flashAlpha = 0.6
        burstParticles(0, 0, 0, 300, 20)
        for (let i = 0; i < compDefs.length; i++) {
          const c = compDefs[i]
          burstParticles(c.pos[0] * boardScale/2, c.pos[1] * boardScale/2, c.pos[2] * boardScale/4, 20, 8)
        }
        sparkDelay = 1
      }
      if (progress < 0.45) sparkDelay = 0

      // ── sparks during crack phase ──
      if (progress > 0.3 && progress < 0.45 && tRef.current % 3 === 0) {
        const tIdx = Math.floor(Math.random() * tracePaths.length)
        const tp = tracePaths[tIdx]
        if (tp && tp.length > 0) {
          const pt = tp[Math.floor(Math.random() * tp.length)]
          addSparks(pt[0] * boardScale/2, pt[1] * boardScale/2, 0, 3)
        }
      }

      // ── update particles ──
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * 0.3; p.y += p.vy * 0.3; p.z += p.vz * 0.3
        p.vx *= 0.98; p.vy *= 0.98; p.vz *= 0.98
        p.vy += 0.01 // gravity
        p.life -= 1 / p.maxLife
        if (p.life <= 0 || Math.abs(p.x) > 200 || Math.abs(p.y) > 200) {
          particles.splice(i, 1)
        }
      }

      // limit particles
      if (particles.length > 1000) particles = particles.slice(-1000)

      // ── reassembly: pull particles back ──
      if (reassemblyIntensity > 0) {
        for (const p of particles) {
          p.vx -= p.x * 0.001 * reassemblyIntensity
          p.vy -= p.y * 0.001 * reassemblyIntensity
          p.vz -= p.z * 0.001 * reassemblyIntensity
        }
      }

      // ── flash decay ──
      if (flashAlpha > 0) flashAlpha *= 0.92

      // ── draw particles (behind) ──
      ctx.save()
      for (const p of particles) {
        const pp = pr(p.x, p.y, p.z)
        if (pp.s < 0.01) continue
        const size = p.size * pp.s * 0.08 * p.life
        if (size < 0.1) continue
        const a = Math.min(1, p.life * 1.5)
        ctx.globalAlpha = a * 0.7
        ctx.beginPath()
        ctx.arc(pp.x, pp.y, size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = p.glow * 12 * a
        ctx.fill()
      }
      ctx.restore()

      // ── draw traces ──
      for (const tp of tracePaths) {
        const traceAlpha = 1 - explosionIntensity * 0.8
        if (traceAlpha < 0.01) continue
        const pts = tp.map(pt => {
          const p = tf([pt[0]*boardScale/2, pt[1]*boardScale/2, 0])
          return pr(p[0], p[1], p[2])
        })
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          const mx = (pts[i-1].x+pts[i].x)/2 + (Math.random()-0.5)*explosionIntensity*40
          const my = (pts[i-1].y+pts[i].y)/2 + (Math.random()-0.5)*explosionIntensity*40
          ctx.quadraticCurveTo(mx, my, pts[i].x, pts[i].y)
        }
        ctx.strokeStyle = `rgba(124,58,237,${0.25 * traceAlpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // glow
        ctx.save()
        ctx.shadowColor = '#7c3aed'
        ctx.shadowBlur = 8 * traceAlpha
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          const mx = (pts[i-1].x+pts[i].x)/2 + (Math.random()-0.5)*explosionIntensity*40
          const my = (pts[i-1].y+pts[i].y)/2 + (Math.random()-0.5)*explosionIntensity*40
          ctx.quadraticCurveTo(mx, my, pts[i].x, pts[i].y)
        }
        ctx.strokeStyle = `rgba(124,58,237,${0.1 * traceAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      // ── draw PCB board ──
      const boardOffset = explosionIntensity * 3
      const boardTilt = explosionIntensity * 0.5
      const bv = [[-boardW/2,-boardH/2,-boardD/2],[boardW/2,-boardH/2,-boardD/2],[boardW/2,boardH/2,-boardD/2],[-boardW/2,boardH/2,-boardD/2],
                  [-boardW/2,-boardH/2,boardD/2],[boardW/2,-boardH/2,boardD/2],[boardW/2,boardH/2,boardD/2],[-boardW/2,boardH/2,boardD/2]]
      const bp = bv.map(v => tf(v, 0, 0, boardOffset + boardTilt * 10))
      const bpr = bp.map(v => pr(v[0], v[1], v[2]))
      ctx.beginPath()
      ctx.moveTo(bpr[0].x, bpr[0].y)
      for (let i = 1; i < 4; i++) ctx.lineTo(bpr[i].x, bpr[i].y)
      ctx.closePath()
      ctx.fillStyle = '#1a1a2e'
      ctx.fill()
      ctx.save()
      ctx.shadowColor = '#7c3aed'
      ctx.shadowBlur = 20 * (1 - explosionIntensity * 0.7)
      ctx.strokeStyle = `rgba(124,58,237,0.1)`
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()

      // ── heat effect ──
      if (heatIntensity > 0) {
        const heatAlpha = heatIntensity * 0.3 * (1 - crackIntensity)
        for (const comp of compDefs) {
          const hx = comp.pos[0] * boardScale/2
          const hy = comp.pos[1] * boardScale/2
          const hz = comp.pos[2] * boardScale/4 + boardOffset
          const hp = tf([hx, hy, hz])
          const hpr = pr(hp[0], hp[1], hp[2])
          const hSize = Math.max(comp.size[0], comp.size[1]) * boardScale / 6 * 2 * hpr.s
          const grd = ctx.createRadialGradient(hpr.x, hpr.y, 0, hpr.x, hpr.y, hSize)
          grd.addColorStop(0, `rgba(255, 80, 0, ${heatAlpha})`)
          grd.addColorStop(0.5, `rgba(255, 150, 0, ${heatAlpha * 0.5})`)
          grd.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(hpr.x, hpr.y, hSize, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        }
      }

      // ── crack lines ──
      if (crackIntensity > 0) {
        const crackAlpha = crackIntensity * (1 - explosionIntensity)
        ctx.strokeStyle = `rgba(255, 200, 100, ${crackAlpha * 0.6})`
        ctx.lineWidth = 1
        for (let i = 0; i < 12; i++) {
          const startX = rand(-boardW/2 * 0.6, boardW/2 * 0.6)
          const startY = rand(-boardH/2 * 0.6, boardH/2 * 0.6)
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          let x = startX, y = startY
          for (let j = 0; j < 5; j++) {
            x += rand(-10, 10) * boardScale
            y += rand(-10, 10) * boardScale
            const cp = tf([x, y, boardD/2 + 0.5], 0, 0, boardOffset)
            const cpr = pr(cp[0], cp[1], cp[2])
            ctx.lineTo(cpr.x, cpr.y)
          }
          ctx.stroke()
        }
      }

      // ── draw components ──
      for (let i = 0; i < compDefs.length; i++) {
        const comp = compDefs[i]
        const gOff = comp.group
        const explodeDir = [
          comp.pos[0]*0.3 + Math.sin(gOff*1.7)*2,
          comp.pos[1]*0.3 + Math.cos(gOff*2.3)*2,
          (1 + Math.sin(gOff*1.1)*0.5)*2,
        ]
        const dPos = explosionIntensity * 3
        const dx = explodeDir[0] * dPos + (Math.random()-0.5) * debrisIntensity * 2
        const dy = explodeDir[1] * dPos + (Math.random()-0.5) * debrisIntensity * 2
        const dz = explodeDir[2] * dPos + boardOffset + explosionIntensity * 5

        const scale3 = boardScale / 6.5
        const s = comp.size
        const box = makeBox(s[0]*scale3, s[1]*scale3, s[2]*scale3)
        const rotX = comp.rot[0] + explosionIntensity * gOff * 0.5
        const rotZ = comp.rot[2] + explosionIntensity * gOff * 0.3

        const transformed = box.map(v => {
          let p = M.mul(M.rx(rotX), v)
          p = M.mul(M.rz(rotZ), p)
          return tf(p, comp.pos[0]*boardScale/2+dx, comp.pos[1]*boardScale/2+dy, comp.pos[2]*boardScale/4+dz)
        })

        const projPoints = transformed.map(p => pr(p[0], p[1], p[2]))

        const sortedFaces = facesIdx.map((fi, idx) => ({
          idx,
          depth: fi.reduce((s, vi) => s + transformed[vi][2], 0) / fi.length,
          pts: fi.map(vi => projPoints[vi]),
        })).sort((a, b) => b.depth - a.depth)

        const alpha = Math.max(0.15, 1 - explosionIntensity * 0.5)

        // glow behind component
        const cx = projPoints.reduce((s, p) => s + p.x, 0) / projPoints.length
        const cy = projPoints.reduce((s, p) => s + p.y, 0) / projPoints.length
        ctx.save()
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25)
        grd.addColorStop(0, comp.color + '22')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy, 25 * (1 + explosionIntensity), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        for (const face of sortedFaces) {
          const pts = face.pts
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
          ctx.closePath()
          const fa = Math.round(alpha * 70).toString(16).padStart(2, '0')
          ctx.fillStyle = comp.color + fa
          ctx.fill()
          ctx.strokeStyle = comp.color + Math.round(Math.min(1, alpha+0.2) * 90).toString(16).padStart(2, '0')
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        if (comp.label && explosionIntensity < 0.7) {
          const topFace = sortedFaces.find(f => f.idx === 2)
          if (topFace) {
            const lx = topFace.pts.reduce((s, p) => s + p.x, 0) / topFace.pts.length
            const ly = topFace.pts.reduce((s, p) => s + p.y, 0) / topFace.pts.length
            ctx.fillStyle = `rgba(255,255,255,${0.4 * alpha})`
            ctx.font = '9px "JetBrains Mono", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(comp.label, lx, ly)
          }
        }
      }

      // ── screen flash ──
      if (flashAlpha > 0.01) {
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`
        ctx.fillRect(0, 0, W, H)
      }

      // ── phase HUD ──
      const hudAlpha = phase.index >= 0 ? Math.min(1, pLocal * 2, (1 - pLocal) * 2) : 0
      if (hudAlpha > 0.01) {
        ctx.save()
        ctx.globalAlpha = hudAlpha * 0.8
        ctx.fillStyle = `rgba(124,58,237,${hudAlpha * 0.15})`
        ctx.fillRect(0, H - 80, W, 80)

        ctx.fillStyle = `rgba(255,255,255,${hudAlpha * 0.9})`
        ctx.font = '11px "JetBrains Mono", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText('> STATUS:', 30, H - 50)

        ctx.fillStyle = `rgba(255,255,255,${hudAlpha})`
        ctx.font = '18px "JetBrains Mono", monospace'
        ctx.fillText(phase.label, 160, H - 50)

        ctx.fillStyle = `rgba(255,255,255,${hudAlpha * 0.5})`
        ctx.font = '11px "JetBrains Mono", monospace'
        ctx.fillText(phase.sub, 160, H - 28)

        // progress bar
        const barX = 500, barY = H - 54, barW = 200, barH = 4
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = `rgba(124,58,237,${hudAlpha * 0.8})`
        ctx.fillRect(barX, barY, barW * progress, barH)
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="scroll-explosion" id="scroll-explosion">
      <canvas ref={canvasRef} className="scroll-explosion__canvas" />
      <div className="scroll-explosion__overlay" />
    </section>
  )
}
