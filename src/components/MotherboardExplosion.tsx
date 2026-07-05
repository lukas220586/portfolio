import { useEffect, useRef } from 'react'

interface Comp3D {
  x: number; y: number; z: number
  w: number; h: number; d: number
  color: string; label?: string
  type: 'chip' | 'slot' | 'cap' | 'conn' | 'vrm'
  group: number
}

const BOARD_W = 280
const BOARD_H = 200
const BOARD_D = 12

const COMPS: Comp3D[] = [
  // CPU
  { x: 80, y: 70, z: 0, w: 50, h: 50, d: 6, color: '#7c3aed', label: 'CPU', type: 'chip', group: 0 },
  // GPU
  { x: 60, y: 130, z: 0, w: 35, h: 35, d: 5, color: '#8b5cf6', label: 'GPU', type: 'chip', group: 0 },
  // Chipset
  { x: 205, y: 130, z: 0, w: 25, h: 25, d: 4, color: '#6366f1', label: 'PCH', type: 'chip', group: 0 },
  // RAM slots
  { x: 225, y: 30, z: 0, w: 8, h: 45, d: 2, color: '#06b6d4', label: 'DDR4', type: 'slot', group: 1 },
  { x: 225, y: 80, z: 0, w: 8, h: 45, d: 2, color: '#06b6d4', type: 'slot', group: 1 },
  // VRM
  { x: 10, y: 60, z: 0, w: 20, h: 10, d: 3, color: '#f59e0b', type: 'vrm', group: 2 },
  { x: 10, y: 75, z: 0, w: 20, h: 10, d: 3, color: '#f59e0b', type: 'vrm', group: 2 },
  { x: 10, y: 90, z: 0, w: 20, h: 10, d: 3, color: '#f59e0b', type: 'vrm', group: 2 },
  { x: 10, y: 105, z: 0, w: 20, h: 10, d: 3, color: '#f59e0b', type: 'vrm', group: 2 },
  // Capacitors
  { x: 30, y: 140, z: 0, w: 8, h: 8, d: 5, color: '#3b82f6', type: 'cap', group: 3 },
  { x: 45, y: 145, z: 0, w: 8, h: 8, d: 5, color: '#3b82f6', type: 'cap', group: 3 },
  { x: 140, y: 155, z: 0, w: 8, h: 8, d: 5, color: '#3b82f6', type: 'cap', group: 3 },
  { x: 155, y: 155, z: 0, w: 8, h: 8, d: 5, color: '#3b82f6', type: 'cap', group: 3 },
  { x: 170, y: 155, z: 0, w: 8, h: 8, d: 5, color: '#3b82f6', type: 'cap', group: 3 },
  // Connectors
  { x: 30, y: 5, z: 0, w: 60, h: 8, d: 4, color: '#10b981', label: 'PCIe x16', type: 'conn', group: 4 },
  { x: 100, y: 5, z: 0, w: 40, h: 8, d: 4, color: '#10b981', label: 'PCIe x8', type: 'conn', group: 4 },
  // SATA
  { x: 240, y: 160, z: 0, w: 12, h: 20, d: 3, color: '#ec4899', label: 'SATA', type: 'conn', group: 5 },
  { x: 240, y: 140, z: 0, w: 12, h: 20, d: 3, color: '#ec4899', type: 'conn', group: 5 },
  // USB
  { x: 0, y: 30, z: 0, w: 12, h: 20, d: 3, color: '#14b8a6', label: 'USB', type: 'conn', group: 5 },
  // I/O chip
  { x: 20, y: 130, z: 0, w: 20, h: 15, d: 3, color: '#ef4444', label: 'SIO', type: 'chip', group: 0 },
  // BIOS
  { x: 210, y: 170, z: 0, w: 15, h: 12, d: 2, color: '#7c3aed', label: 'BIOS', type: 'chip', group: 0 },
  // Audio
  { x: 230, y: 100, z: 0, w: 15, h: 15, d: 3, color: '#10b981', label: 'AUDIO', type: 'chip', group: 0 },
]

const TRACES: [number, number, number][][] = [
  [[10,65],[30,65],[50,70],[80,70]],
  [[10,80],[30,80],[50,80],[80,75]],
  [[10,95],[30,95],[50,95],[80,80]],
  [[80,95],[130,130],[205,130]],
  [[30,10],[80,10],[80,70]],
  [[100,10],[100,40],[130,40],[130,130]],
  [[80,120],[80,150],[140,155]],
  [[80,120],[80,130],[20,130]],
  [[210,170],[210,155],[205,155]],
  [[225,50],[210,50],[205,70]],
  [[225,100],[230,100]],
  [[240,160],[205,155]],
  [[80,70],[80,50],[225,50]],
]

const SCREW_HOLES = [[8,8],[272,8],[8,192],[272,192]]

export default function MotherboardExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let animId: number
    let progress = 0
    let frame = 0
    const mouse = { x: 0, y: 0 }

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
      const offset = -rect.top / vh
      progress = Math.max(0, Math.min(1, offset))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function isometric(x: number, y: number, z: number, CX: number, CY: number, scale: number, rot: number) {
      const cos = Math.cos(rot), sin = Math.sin(rot)
      const rx = (x - 140) * cos - (y - 100) * sin
      const ry = (x - 140) * sin + (y - 100) * cos
      const iz = ry * 0.5
      return {
        x: CX + (rx - iz) * scale,
        y: CY + (ry * 0.5 + iz - z) * scale,
      }
    }

    function draw() {
      const W = c.width, H = c.height
      const CX = W / 2, CY = H / 2 + 30
      frame++

      ctx.clearRect(0, 0, W, H)

      const baseScale = Math.min(W, H) / 550
      const rot = frame / 400 + mouse.x * 0.1

      // ── explosion values ──
      const layerSep = progress * 35
      const compFloat = progress * 25
      const traceWarp = progress

      // ── layer colors ──
      const topColor = '#1a1a3e'
      const subColor = '#1a2a1e'
      const botColor = '#0d1a2e'

      // ── draw bottom layer ──
      const bl = [
        isometric(0, 0, -BOARD_D - layerSep, CX, CY, baseScale, rot),
        isometric(BOARD_W, 0, -BOARD_D - layerSep, CX, CY, baseScale, rot),
        isometric(BOARD_W, BOARD_H, -BOARD_D - layerSep, CX, CY, baseScale, rot),
        isometric(0, BOARD_H, -BOARD_D - layerSep, CX, CY, baseScale, rot),
      ]
      ctx.beginPath()
      ctx.moveTo(bl[0].x, bl[0].y)
      for (let i = 1; i < 4; i++) ctx.lineTo(bl[i].x, bl[i].y)
      ctx.closePath()
      ctx.fillStyle = botColor
      ctx.fill()
      ctx.strokeStyle = 'rgba(59,130,246,0.2)'
      ctx.lineWidth = 1
      ctx.stroke()

      // bottom traces
      for (const trace of TRACES) {
        const pts = trace.map(p => isometric(p[0], p[1], -BOARD_D - layerSep, CX, CY, baseScale, rot))
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          if (traceWarp > 0.01) {
            const mx = (pts[i-1].x + pts[i].x) / 2 + (Math.random() - 0.5) * traceWarp * 15
            const my = (pts[i-1].y + pts[i].y) / 2 + (Math.random() - 0.5) * traceWarp * 15
            ctx.quadraticCurveTo(mx, my, pts[i].x, pts[i].y)
          } else {
            ctx.lineTo(pts[i].x, pts[i].y)
          }
        }
        ctx.strokeStyle = 'rgba(59,130,246,0.12)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // ── draw substrate ──
      const sl = [
        isometric(0, 0, -layerSep * 0.5, CX, CY, baseScale, rot),
        isometric(BOARD_W, 0, -layerSep * 0.5, CX, CY, baseScale, rot),
        isometric(BOARD_W, BOARD_H, -layerSep * 0.5, CX, CY, baseScale, rot),
        isometric(0, BOARD_H, -layerSep * 0.5, CX, CY, baseScale, rot),
      ]
      ctx.beginPath()
      ctx.moveTo(sl[0].x, sl[0].y)
      for (let i = 1; i < 4; i++) ctx.lineTo(sl[i].x, sl[i].y)
      ctx.closePath()
      ctx.fillStyle = subColor
      ctx.fill()
      ctx.strokeStyle = 'rgba(16,185,129,0.15)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // vias through substrate
      const viaAlpha = 0.3 + traceWarp * 0.3
      for (let i = 0; i < 30; i++) {
        const vx = 10 + Math.random() * (BOARD_W - 20)
        const vy = 10 + Math.random() * (BOARD_H - 20)
        const vp = isometric(vx, vy, -layerSep * 0.5, CX, CY, baseScale, rot)
        ctx.beginPath()
        ctx.arc(vp.x, vp.y, 1.5 * baseScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${viaAlpha * 0.1})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(vp.x, vp.y, 0.5 * baseScale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${viaAlpha * 0.3})`
        ctx.fill()
      }

      // ── draw top layer (PCB) ──
      const tl = [
        isometric(0, 0, 0, CX, CY, baseScale, rot),
        isometric(BOARD_W, 0, 0, CX, CY, baseScale, rot),
        isometric(BOARD_W, BOARD_H, 0, CX, CY, baseScale, rot),
        isometric(0, BOARD_H, 0, CX, CY, baseScale, rot),
      ]
      ctx.beginPath()
      ctx.moveTo(tl[0].x, tl[0].y)
      for (let i = 1; i < 4; i++) ctx.lineTo(tl[i].x, tl[i].y)
      ctx.closePath()
      ctx.fillStyle = topColor
      ctx.fill()
      ctx.strokeStyle = 'rgba(124,58,237,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      // board glow
      ctx.save()
      ctx.shadowColor = '#7c3aed'
      ctx.shadowBlur = 15 * (1 - progress * 0.5)
      ctx.strokeStyle = 'rgba(124,58,237,0.05)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      ctx.restore()

      // ── screw holes ──
      for (const [sx, sy] of SCREW_HOLES) {
        const sp = isometric(sx, sy, 0, CX, CY, baseScale, rot)
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 5 * baseScale, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, 2 * baseScale, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.fill()
      }

      // ── top traces ──
      for (const trace of TRACES) {
        const pts = trace.map(p => isometric(p[0], p[1], 0.5, CX, CY, baseScale, rot))
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          if (traceWarp > 0.05) {
            const mx = (pts[i-1].x + pts[i].x) / 2 + (Math.random() - 0.5) * traceWarp * 20
            const my = (pts[i-1].y + pts[i].y) / 2 + (Math.random() - 0.5) * traceWarp * 20
            ctx.quadraticCurveTo(mx, my, pts[i].x, pts[i].y)
          } else {
            ctx.lineTo(pts[i].x, pts[i].y)
          }
        }
        ctx.strokeStyle = `rgba(124,58,237,${0.2 + traceWarp * 0.1})`
        ctx.lineWidth = 0.8 + traceWarp
        ctx.stroke()

        // glow
        ctx.save()
        ctx.shadowColor = '#7c3aed'
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length; i++) {
          if (traceWarp > 0.05) {
            const mx = (pts[i-1].x + pts[i].x) / 2 + (Math.random() - 0.5) * traceWarp * 20
            const my = (pts[i-1].y + pts[i].y) / 2 + (Math.random() - 0.5) * traceWarp * 20
            ctx.quadraticCurveTo(mx, my, pts[i].x, pts[i].y)
          } else {
            ctx.lineTo(pts[i].x, pts[i].y)
          }
        }
        ctx.strokeStyle = `rgba(124,58,237,0.08)`
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()
      }

      // ── components ──
      for (const comp of COMPS) {
        const gOff = comp.group
        const explodeDir = [
          (comp.x - 140) * 0.02 + Math.sin(gOff * 1.7) * 15,
          (comp.y - 100) * 0.02 + Math.cos(gOff * 2.3) * 15,
          2 + Math.sin(gOff * 1.1) * 1.5,
        ]
        const dPos = compFloat * 1.2
        const dx = (comp.x - 140) * 0.05 + explodeDir[0] * dPos * 0.02
        const dy = (comp.y - 100) * 0.05 + explodeDir[1] * dPos * 0.02
        const dz = dPos * explodeDir[2] * 0.3 + layerSep * 0.3

        const cx = comp.x + dx
        const cy = comp.y + dy
        const cz = comp.d + dz

        // component shadow on board
        if (compFloat < 0.8) {
          const sp = isometric(cx, cy, 0.2, CX, CY, baseScale, rot)
          const sw = comp.w * baseScale * 1.1
          const sh = comp.h * baseScale * 1.1
          ctx.save()
          ctx.globalAlpha = 0.1 * (1 - compFloat)
          ctx.fillStyle = '#000'
          ctx.beginPath()
          ctx.ellipse(sp.x, sp.y, sw / 2, sh / 2, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        const p1 = isometric(cx, cy, cz, CX, CY, baseScale, rot)
        const p2 = isometric(cx + comp.w, cy, cz, CX, CY, baseScale, rot)
        const p3 = isometric(cx + comp.w, cy + comp.h, cz, CX, CY, baseScale, rot)
        const p4 = isometric(cx, cy + comp.h, cz, CX, CY, baseScale, rot)
        const p5 = isometric(cx, cy, cz + comp.d, CX, CY, baseScale, rot)
        const p6 = isometric(cx + comp.w, cy, cz + comp.d, CX, CY, baseScale, rot)
        const p7 = isometric(cx + comp.w, cy + comp.h, cz + comp.d, CX, CY, baseScale, rot)
        const p8 = isometric(cx, cy + comp.h, cz + comp.d, CX, CY, baseScale, rot)

        const depthAlpha = 0.6 + (1 - Math.abs(dz) / 40) * 0.4
        const a = Math.round(Math.min(1, depthAlpha) * 70).toString(16).padStart(2, '0')
        const strokeA = Math.round(Math.min(1, depthAlpha) * 90).toString(16).padStart(2, '0')

        // top face
        ctx.beginPath()
        ctx.moveTo(p5.x, p5.y)
        ctx.lineTo(p6.x, p6.y)
        ctx.lineTo(p7.x, p7.y)
        ctx.lineTo(p8.x, p8.y)
        ctx.closePath()
        ctx.fillStyle = comp.color + a
        ctx.fill()
        ctx.strokeStyle = comp.color + strokeA
        ctx.lineWidth = 0.5
        ctx.stroke()

        // right face
        ctx.beginPath()
        ctx.moveTo(p2.x, p2.y)
        ctx.lineTo(p6.x, p6.y)
        ctx.lineTo(p7.x, p7.y)
        ctx.lineTo(p3.x, p3.y)
        ctx.closePath()
        const darkA = Math.round(Math.min(1, depthAlpha * 0.7) * 70).toString(16).padStart(2, '0')
        ctx.fillStyle = '#000' + darkA
        ctx.fill()

        // front face
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p5.x, p5.y)
        ctx.lineTo(p8.x, p8.y)
        ctx.lineTo(p4.x, p4.y)
        ctx.closePath()
        ctx.fillStyle = '#000' + darkA
        ctx.fill()

        // label
        if (comp.label && progress < 0.85) {
          const lx = (p5.x + p6.x + p7.x + p8.x) / 4
          const ly = (p5.y + p6.y + p7.y + p8.y) / 4
          ctx.fillStyle = `rgba(255,255,255,${0.35 * depthAlpha})`
          ctx.font = `${8 * baseScale}px "JetBrains Mono", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(comp.label, lx, ly)
        }

        // glow
        const gx = (p1.x + p2.x + p3.x + p4.x) / 4
        const gy = (p1.y + p2.y + p3.y + p4.y) / 4
        ctx.save()
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 20 * baseScale)
        grd.addColorStop(0, comp.color + '22')
        grd.addColorStop(1, 'transparent')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(gx, gy, 20 * baseScale, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // ── RE annotations ──
      if (progress > 0.15) {
        const annAlpha = Math.min(1, (progress - 0.15) / 0.15)

        // measurement lines
        const ml = isometric(10, 10, -BOARD_D - layerSep - 5, CX, CY, baseScale, rot)
        const mr = isometric(270, 10, -BOARD_D - layerSep - 5, CX, CY, baseScale, rot)
        ctx.save()
        ctx.globalAlpha = annAlpha * 0.4
        ctx.strokeStyle = '#7c3aed'
        ctx.lineWidth = 0.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(ml.x, ml.y)
        ctx.lineTo(mr.x, mr.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#7c3aed'
        ctx.font = '8px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText('246.3mm', (ml.x + mr.x) / 2, ml.y - 8)

        // vertical measurement
        const mv = isometric(10, 10, -BOARD_D - layerSep - 5, CX, CY, baseScale, rot)
        const mb = isometric(10, 190, -BOARD_D - layerSep - 5, CX, CY, baseScale, rot)
        ctx.setLineDash([4, 4])
        ctx.strokeStyle = '#3b82f6'
        ctx.beginPath()
        ctx.moveTo(mv.x, mv.y)
        ctx.lineTo(mb.x, mb.y)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#3b82f6'
        ctx.textAlign = 'right'
        ctx.fillText('173.8mm', mv.x - 8, (mv.y + mb.y) / 2)
        ctx.restore()

        // crosshairs
        if (progress > 0.4) {
          const ch = Math.min(1, (progress - 0.4) / 0.1)
          ctx.save()
          ctx.globalAlpha = annAlpha * ch * 0.6
          for (const comp of COMPS.filter(c => c.label)) {
            const cxp = isometric(comp.x + comp.w/2, comp.y + comp.h/2, comp.d + compFloat * 2 + layerSep * 0.3, CX, CY, baseScale, rot)
            const len = 12 * baseScale
            ctx.strokeStyle = '#ec4899'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(cxp.x - len, cxp.y)
            ctx.lineTo(cxp.x + len, cxp.y)
            ctx.moveTo(cxp.x, cxp.y - len)
            ctx.lineTo(cxp.x, cxp.y + len)
            ctx.stroke()
          }
          ctx.restore()
        }
      }

      // ── phase indicator ──
      const phaseLabels = [
        { at: 0, label: 'PCB ASSEMBLED' },
        { at: 0.2, label: 'THERMAL SCAN' },
        { at: 0.4, label: 'LAYER SEPARATION' },
        { at: 0.6, label: 'COMPONENT EXTRACTION' },
        { at: 0.8, label: 'FULL EXPLODED VIEW' },
      ]
      let phaseLabel = phaseLabels[0].label
      let phaseIdx = 0
      for (let i = phaseLabels.length - 1; i >= 0; i--) {
        if (progress >= phaseLabels[i].at) { phaseLabel = phaseLabels[i].label; phaseIdx = i; break }
      }
      const phaseProgress = (progress - phaseLabels[phaseIdx].at) / ((phaseLabels[phaseIdx+1]?.at ?? 1) - phaseLabels[phaseIdx].at)

      if (progress > 0.01) {
        const pa = Math.min(1, phaseProgress * 3, (1 - phaseProgress) * 3)
        ctx.save()
        ctx.globalAlpha = pa * 0.7
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(0, H - 60, W, 60)
        ctx.fillStyle = '#7c3aed'
        ctx.font = '10px "JetBrains Mono", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.fillText('$ re --explode --progress ' + Math.round(progress * 100) + '%', 20, H - 38)
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.font = '16px "JetBrains Mono", monospace'
        ctx.fillText(phaseLabel, 20, H - 16)
        ctx.restore()
      }

      // ── scanline ──
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.fillStyle = '#000'
      for (let i = 0; i < H; i += 4) {
        ctx.fillRect(0, i, W, 1)
      }
      ctx.restore()

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
    <section className="motherboard-section" id="motherboard-explosion">
      <div className="motherboard-section__header">
        <span className="motherboard-section__tag">REVERSE ENGINEERING</span>
        <h2 className="motherboard-section__title">Hardware Deconstruction</h2>
        <p className="motherboard-section__desc">
          Scroll to disassemble — every layer, every component, every connection
        </p>
      </div>
      <canvas ref={canvasRef} className="motherboard-canvas" />
    </section>
  )
}
