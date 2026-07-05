import { useEffect, useRef } from 'react'

// ── 3D vector math ──
const mat3 = {
  rotateX: (a: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    return [1,0,0, 0,c,s, 0,-s,c] as number[]
  },
  rotateY: (a: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    return [c,0,-s, 0,1,0, s,0,c] as number[]
  },
  rotateZ: (a: number) => {
    const c = Math.cos(a), s = Math.sin(a)
    return [c,s,0, -s,c,0, 0,0,1] as number[]
  },
  mul: (m: number[], v: number[]) => [
    m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
    m[3]*v[0]+m[4]*v[1]+m[5]*v[2],
    m[6]*v[0]+m[7]*v[1]+m[8]*v[2],
  ],
}

function project(x: number, y: number, z: number, w: number, h: number, fov = 800) {
  const d = fov + z
  if (d < 1) return { x: w/2, y: h/2, s: 0 }
  const s = fov / d
  return { x: x * s + w/2, y: y * s + h/2, s }
}

type Vert3 = [number, number, number]

interface CompDef {
  pos: [number, number, number]
  rot: [number, number, number]
  size: [number, number, number]
  color: string
  glow: number
  group: number
  type: 'chip' | 'cap' | 'conn' | 'res'
  label?: string
}

// ── component definitions ──
function makeBox(sx: number, sy: number, sz: number): Vert3[] {
  const hx = sx / 2, hy = sy / 2, hz = sz / 2
  return [
    [-hx,-hy,-hz], [ hx,-hy,-hz], [ hx, hy,-hz], [-hx, hy,-hz],
    [-hx,-hy, hz], [ hx,-hy, hz], [ hx, hy, hz], [-hx, hy, hz],
  ]
}

function getFaces(_v: Vert3[]): number[][] {
  return [
    [0,1,2,3], [4,5,6,7], // front, back
    [0,1,5,4], [2,3,7,6], // top, bottom
    [0,3,7,4], [1,2,6,5], // left, right
  ]
}

const compDefs: CompDef[] = [
  // CPU (center)
  { pos: [0, 0, 0.5], rot: [0, 0, 0], size: [3.2, 3.2, 0.3], color: '#7c3aed', glow: 0.8, group: 0, type: 'chip', label: 'CPU' },
  // GPU
  { pos: [-4, -3, 0.4], rot: [0, 0.1, 0], size: [2.8, 2.8, 0.25], color: '#8b5cf6', glow: 0.5, group: 0, type: 'chip', label: 'GPU' },
  // RAM modules
  { pos: [4.5, -1.5, 0.3], rot: [0, 0, 0], size: [0.6, 2.4, 0.2], color: '#6366f1', glow: 0.4, group: 1, type: 'chip' },
  { pos: [4.5, 1.5, 0.3], rot: [0, 0, 0], size: [0.6, 2.4, 0.2], color: '#6366f1', glow: 0.4, group: 1, type: 'chip' },
  // Capacitors
  { pos: [-2, 4, 0.2], rot: [0, 0, 0], size: [0.5, 0.5, 0.4], color: '#06b6d4', glow: 0.3, group: 2, type: 'cap' },
  { pos: [-1, 4.2, 0.2], rot: [0, 0, 0], size: [0.5, 0.5, 0.4], color: '#06b6d4', glow: 0.3, group: 2, type: 'cap' },
  { pos: [0, 4.3, 0.2], rot: [0, 0, 0], size: [0.5, 0.5, 0.4], color: '#06b6d4', glow: 0.3, group: 2, type: 'cap' },
  { pos: [1, 4.2, 0.2], rot: [0, 0, 0], size: [0.5, 0.5, 0.4], color: '#06b6d4', glow: 0.3, group: 2, type: 'cap' },
  { pos: [2, 4, 0.2], rot: [0, 0, 0], size: [0.5, 0.5, 0.4], color: '#06b6d4', glow: 0.3, group: 2, type: 'cap' },
  // Connectors
  { pos: [-5.5, 0, 0.2], rot: [0, 0, 0], size: [0.4, 3, 0.3], color: '#3b82f6', glow: 0.5, group: 3, type: 'conn' },
  { pos: [5.5, 0, 0.2], rot: [0, 0, 0], size: [0.4, 3, 0.3], color: '#3b82f6', glow: 0.5, group: 3, type: 'conn' },
  // Resistors
  { pos: [-3.5, 3.5, 0.1], rot: [0, 0, 0.2], size: [0.3, 0.6, 0.15], color: '#ec4899', glow: 0.2, group: 4, type: 'res' },
  { pos: [-2.5, 3.8, 0.1], rot: [0, 0, -0.1], size: [0.3, 0.6, 0.15], color: '#ec4899', glow: 0.2, group: 4, type: 'res' },
  { pos: [3.5, 3.5, 0.1], rot: [0, 0, 0.15], size: [0.3, 0.6, 0.15], color: '#f59e0b', glow: 0.2, group: 4, type: 'res' },
  { pos: [2.5, 3.8, 0.1], rot: [0, 0, -0.1], size: [0.3, 0.6, 0.15], color: '#f59e0b', glow: 0.2, group: 4, type: 'res' },
  // Extra chips
  { pos: [-4.5, -3.5, 0.2], rot: [0, 0, 0.5], size: [1.2, 1.2, 0.2], color: '#14b8a6', glow: 0.3, group: 5, type: 'chip' },
  { pos: [4, -3.5, 0.2], rot: [0, 0, -0.3], size: [1.8, 0.8, 0.2], color: '#10b981', glow: 0.3, group: 5, type: 'chip' },
  // VRM area
  { pos: [-5, 3, 0.2], rot: [0, 0, 0], size: [0.6, 0.8, 0.2], color: '#f59e0b', glow: 0.3, group: 6, type: 'chip' },
  { pos: [-5, 2, 0.2], rot: [0, 0, 0], size: [0.6, 0.8, 0.2], color: '#f59e0b', glow: 0.3, group: 6, type: 'chip' },
  { pos: [-5.5, -2, 0.2], rot: [0, 0, 0], size: [0.6, 0.8, 0.2], color: '#f59e0b', glow: 0.3, group: 6, type: 'chip' },
  { pos: [-5.5, -3, 0.2], rot: [0, 0, 0], size: [0.6, 0.8, 0.2], color: '#f59e0b', glow: 0.3, group: 6, type: 'chip' },
]

// ── traces (PCB lines) ──
const tracePoints: [number,number,number][][] = [
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

const PALLETE = { bg: '#0a0a12', pcb: '#1a1a2e', trace: '#7c3aed' }

export default function TechExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let animId: number
    const mouse = { x: 0, y: 0 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / canvas.width - 0.5) * 2
      mouse.y = (e.clientY / canvas.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    // ── scroll tracking ──
    const onScroll = () => {
      const scrollY = window.scrollY
      const wh = window.innerHeight
      // progress goes 0→1 over first 2 viewport heights
      const raw = scrollY / (wh * 2)
      progressRef.current = Math.min(1, Math.max(0, raw))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const draw = () => {
      const W = canvas.width, H = canvas.height
      const CX = W / 2, CY = H / 2
      const progress = progressRef.current

      // ── camera orbit ──
      const rx = 0.4 + Math.sin(Date.now() / 8000) * 0.15 + mouse.y * 0.1
      const ry = Date.now() / 12000 + mouse.x * 0.2

      ctx.clearRect(0, 0, W, H)

      // ── PCB board ──
      const boardScale = 6
      const boardW = 7.5 * boardScale
      const boardH = 5.5 * boardScale
      const boardD = 0.3 * boardScale

      const bv: Vert3[] = [
        [-boardW/2, -boardH/2, -boardD/2],
        [ boardW/2, -boardH/2, -boardD/2],
        [ boardW/2,  boardH/2, -boardD/2],
        [-boardW/2,  boardH/2, -boardD/2],
        [-boardW/2, -boardH/2,  boardD/2],
        [ boardW/2, -boardH/2,  boardD/2],
        [ boardW/2,  boardH/2,  boardD/2],
        [-boardW/2,  boardH/2,  boardD/2],
      ]

      const boardTilt = progress * 0.3

      const tf = (v: number[], dx = 0, dy = 0, dz = 0, rr = rx) => {
        let p = mat3.mul(mat3.rotateX(rr), v)
        p = mat3.mul(mat3.rotateY(ry), p)
        return [p[0] + dx, p[1] + dy, p[2] + dz + boardTilt * 10] as number[]
      }

      const projected: { x: number; y: number; s: number }[] = []
      for (const v of bv) {
        const t = tf(v)
        projected.push(project(t[0], t[1], t[2], CX, CY, 500))
      }

      // draw PCB faces
      ctx.beginPath()
      const bi = [0,1,2,3]
      ctx.moveTo(projected[bi[0]].x, projected[bi[0]].y)
      for (let i = 1; i < 4; i++) ctx.lineTo(projected[bi[i]].x, projected[bi[i]].y)
      ctx.closePath()
      ctx.fillStyle = PALLETE.pcb
      ctx.fill()
      ctx.strokeStyle = 'rgba(124,58,237,0.15)'
      ctx.lineWidth = 1
      ctx.stroke()

      // board edge glow
      ctx.save()
      ctx.shadowColor = '#7c3aed'
      ctx.shadowBlur = 20 * (1 - progress * 0.5)
      ctx.strokeStyle = 'rgba(124,58,237,0.1)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()

      // ── board Z offset (for component disassembly) ──
      const boardOffset = progress * 2.5

      // ── traces ──
      for (const tp of tracePoints) {
        const pts = tp.map(p => tf([p[0]*boardScale/2, p[1]*boardScale/2, p[2]*boardScale/4], 0, 0, boardOffset))
        const pp = pts.map(p => project(p[0], p[1], p[2], CX, CY, 500))
        if (pp.length < 2) continue

        const traceAlpha = 1 - progress * 0.7
        ctx.beginPath()
        ctx.moveTo(pp[0].x, pp[0].y)
        for (let i = 1; i < pp.length; i++) {
          const midX = (pp[i-1].x + pp[i].x) / 2 + (Math.random() - 0.5) * progress * 30
          const midY = (pp[i-1].y + pp[i].y) / 2 + (Math.random() - 0.5) * progress * 30
          ctx.quadraticCurveTo(midX, midY, pp[i].x, pp[i].y)
        }
        ctx.strokeStyle = `rgba(124,58,237,${0.3 * traceAlpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // glow on trace
        ctx.save()
        ctx.shadowColor = '#7c3aed'
        ctx.shadowBlur = 6 * traceAlpha
        ctx.beginPath()
        ctx.moveTo(pp[0].x, pp[0].y)
        for (let i = 1; i < pp.length; i++) {
          const midX = (pp[i-1].x + pp[i].x) / 2 + (Math.random() - 0.5) * progress * 30
          const midY = (pp[i-1].y + pp[i].y) / 2 + (Math.random() - 0.5) * progress * 30
          ctx.quadraticCurveTo(midX, midY, pp[i].x, pp[i].y)
        }
        ctx.strokeStyle = `rgba(124,58,237,${0.1 * traceAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      // ── components ──
      for (let i = 0; i < compDefs.length; i++) {
        const c = compDefs[i]
        // disassembly offset per group
        const gOff = c.group
        const explodeDir = [
          (c.pos[0] * 0.3 + (Math.sin(gOff * 1.7) * 2)),
          (c.pos[1] * 0.3 + (Math.cos(gOff * 2.3) * 2)),
          (1 + Math.sin(gOff * 1.1) * 0.5) * 2,
        ]
        const dPos = progress * 2

        const dx = explodeDir[0] * dPos
        const dy = explodeDir[1] * dPos
        const dz = explodeDir[2] * dPos + boardOffset + progress * 3 + c.glow * progress * 2

        const scale3 = boardScale / 6.5
        const s = c.size
        const box = makeBox(s[0] * scale3, s[1] * scale3, s[2] * scale3)

        const rotX = c.rot[0] + progress * gOff * 0.3
        const rotZ = c.rot[2] + progress * gOff * 0.2

        const transformed = box.map(v => {
          let p: Vert3 = mat3.mul(mat3.rotateX(rotX), v) as Vert3
          p = mat3.mul(mat3.rotateZ(rotZ), p) as Vert3
          return tf(
            p,
            c.pos[0] * boardScale/2 + dx,
            c.pos[1] * boardScale/2 + dy,
            c.pos[2] * boardScale/4 + dz,
          )
        })

        const projected3 = transformed.map(p => project(p[0], p[1], p[2], CX, CY, 500))

        // sort faces by depth for proper rendering
        const faces = getFaces(transformed as unknown as Vert3[])
        const sortedFaces = faces.map((f, fi) => ({
          idx: fi,
          depth: f.reduce((sum, vi) => sum + transformed[vi][2], 0) / f.length,
          pts: f.map(vi => projected3[vi]),
        })).sort((a, b) => b.depth - a.depth)

        const alpha = Math.max(0.2, 1 - progress * 0.4)

        // draw component glow
        ctx.save()
        const cx = projected3.reduce((s, p) => s + p.x, 0) / projected3.length
        const cy2 = projected3.reduce((s, p) => s + p.y, 0) / projected3.length
        const grd = ctx.createRadialGradient(cx, cy2, 0, cx, cy2, 20)
        grd.addColorStop(0, c.color + '33')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(cx, cy2, 20 * (1 + progress), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        for (const face of sortedFaces) {
          const pts = face.pts
          ctx.beginPath()
          ctx.moveTo(pts[0].x, pts[0].y)
          for (let j = 1; j < pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y)
          ctx.closePath()

          ctx.fillStyle = c.color + Math.round(alpha * 80).toString(16).padStart(2, '0')
          ctx.fill()
          ctx.strokeStyle = c.color + Math.round(Math.min(1, alpha + 0.2) * 100).toString(16).padStart(2, '0')
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

        // label on top face
        if (c.label) {
          const topFace = sortedFaces.find(f => f.idx === 2) // top face
          if (topFace) {
            const cx2 = topFace.pts.reduce((s, p) => s + p.x, 0) / topFace.pts.length
            const cy3 = topFace.pts.reduce((s, p) => s + p.y, 0) / topFace.pts.length
            ctx.fillStyle = `rgba(255,255,255,${0.5 * alpha})`
            ctx.font = '9px "JetBrains Mono", monospace'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(c.label, cx2, cy3)
          }
        }
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
    <canvas ref={canvasRef} className="tech-explosion-canvas" />
  )
}
