import { useEffect, useRef } from 'react'

interface Node3D {
  id: string
  label: string
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  size: number
  color: string
  group: string
}

interface Edge {
  from: number; to: number
}

const colors = [
  '#7c3aed', '#3b82f6', '#06b6d4', '#ec4899',
  '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#14b8a6', '#6366f1',
]

const rawNodes = [
  { id: 'luca', label: 'Luca Pugliese', size: 6, color: '#f0f0f5', group: 'core' },
  { id: 'embedded', label: 'Embedded', size: 3.5, color: colors[0], group: 'domain' },
  { id: 'firmware', label: 'Firmware', size: 3.5, color: colors[1], group: 'domain' },
  { id: 'pcb', label: 'PCB Design', size: 3.5, color: colors[2], group: 'domain' },
  { id: 'reverse', label: 'Reverse Eng', size: 3.5, color: colors[3], group: 'domain' },
  { id: 'audio', label: 'Audio', size: 3.5, color: colors[4], group: 'domain' },
  { id: 'cad', label: 'CAD & Fab', size: 3.5, color: colors[5], group: 'domain' },
  { id: 'industrial', label: 'Industrial', size: 3.5, color: colors[6], group: 'domain' },
  { id: 'software', label: 'Software', size: 3.5, color: colors[7], group: 'domain' },
  { id: 'analog', label: 'Analog', size: 3.5, color: colors[8], group: 'domain' },
  { id: 'debug', label: 'Debug & Test', size: 3.5, color: colors[9], group: 'domain' },
  { id: 'c', label: 'C/C++', size: 2, color: colors[0], group: 'skill' },
  { id: 'python', label: 'Python', size: 2, color: colors[7], group: 'skill' },
  { id: 'stm32', label: 'STM32', size: 2, color: colors[0], group: 'skill' },
  { id: 'esp32', label: 'ESP32', size: 2, color: colors[0], group: 'skill' },
  { id: 'kicad', label: 'KiCad', size: 2, color: colors[2], group: 'skill' },
  { id: 'freeRTOS', label: 'FreeRTOS', size: 2, color: colors[1], group: 'skill' },
  { id: 'can', label: 'CAN bus', size: 2, color: colors[6], group: 'skill' },
  { id: 'modbus', label: 'Modbus', size: 2, color: colors[6], group: 'skill' },
  { id: 'ghidra', label: 'Ghidra', size: 2, color: colors[3], group: 'skill' },
  { id: 'fusion', label: 'Fusion 360', size: 2, color: colors[5], group: 'skill' },
  { id: 'altium', label: 'Altium', size: 2, color: colors[2], group: 'skill' },
  { id: 'wpf', label: 'WPF/.NET', size: 2, color: colors[7], group: 'skill' },
  { id: 'docker', label: 'Docker', size: 2, color: colors[7], group: 'skill' },
  { id: 'rust', label: 'Rust', size: 2, color: colors[7], group: 'skill' },
]

const edges: Edge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
  { from: 0, to: 7 }, { from: 0, to: 8 }, { from: 0, to: 9 },
  { from: 0, to: 10 },
  { from: 1, to: 11 }, { from: 1, to: 13 }, { from: 1, to: 14 },
  { from: 1, to: 15 }, { from: 1, to: 16 },
  { from: 2, to: 11 }, { from: 2, to: 16 },
  { from: 3, to: 15 }, { from: 3, to: 21 },
  { from: 4, to: 19 },
  { from: 5, to: 20 }, { from: 5, to: 15 },
  { from: 6, to: 17 }, { from: 6, to: 18 }, { from: 6, to: 20 },
  { from: 7, to: 18 },
  { from: 8, to: 12 }, { from: 8, to: 22 }, { from: 8, to: 23 },
  { from: 8, to: 24 },
  { from: 9, to: 20 }, { from: 9, to: 15 },
  { from: 10, to: 21 },
  { from: 11, to: 13 }, { from: 11, to: 14 },
  { from: 12, to: 22 },
  { from: 13, to: 17 }, { from: 14, to: 17 },
]

export default function BrainGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let animId: number
    let mouseX = 0, _mouseY = 0
    const nodes: Node3D[] = rawNodes.map(n => ({
      ...n,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 200,
      vx: 0, vy: 0, vz: 0,
    }))

    let rotY = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / canvas.width - 0.5) * 2
      _mouseY = (e.clientY / canvas.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const simulate = () => {
      const REPEL = 0.5
      const ATTRACT = 0.008
      const DAMPING = 0.85
      const CENTER = 0.01

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          let dx = a.x - b.x
          let dy = a.y - b.y
          let dz = a.z - b.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
          const force = REPEL / (dist * dist + 10)
          a.vx += dx * force
          a.vy += dy * force
          a.vz += dz * force
          b.vx -= dx * force
          b.vy -= dy * force
          b.vz -= dz * force
        }

        a.x += a.vx; a.y += a.vy; a.z += a.vz
        a.vx *= DAMPING; a.vy *= DAMPING; a.vz *= DAMPING
        a.x -= a.x * CENTER; a.y -= a.y * CENTER; a.z -= a.z * CENTER
      }

      for (const e of edges) {
        const a = nodes[e.from]
        const b = nodes[e.to]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dz = b.z - a.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
        const force = (dist - 120) * ATTRACT
        a.vx += dx * force
        a.vy += dy * force
        a.vz += dz * force
        b.vx -= dx * force
        b.vy -= dy * force
        b.vz -= dz * force
      }
    }

    const project = (x: number, y: number, z: number) => {
      const d = 600 + z
      const scale = 400 / d
      return { sx: x * scale + canvas.width / 2, sy: y * scale + canvas.height / 2, scale }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 3; i++) simulate()
      rotY += 0.003 + mouseX * 0.001

      const sorted = nodes.map((n, i) => ({ ...n, idx: i })).sort((a, b) => a.z - b.z)

      const cos = Math.cos(rotY)
      const sin = Math.sin(rotY)

      for (const e of edges) {
        const a = nodes[e.from]; const b = nodes[e.to]
        const ax = a.x * cos - a.z * sin
        const az = a.x * sin + a.z * cos
        const bx = b.x * cos - b.z * sin
        const bz = b.x * sin + b.z * cos
        const p1 = project(ax, a.y, az)
        const p2 = project(bx, b.y, bz)
        const depthAlpha = Math.max(0, 1 - (Math.abs(a.z) / 500) * 0.5)
        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.08 * depthAlpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      for (const n of sorted) {
        const rx = n.x * cos - n.z * sin
        const rz = n.x * sin + n.z * cos
        const p = project(rx, n.y, rz)
        const depthAlpha = Math.max(0.1, 1 - Math.abs(n.z) / 500)
        const size = n.size * p.scale * 0.05 * depthAlpha
        if (size < 0.3) continue

        ctx.beginPath()
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = depthAlpha * 0.8
        ctx.fill()

        if (n.group !== 'skill' && size > 1.5) {
          ctx.globalAlpha = depthAlpha * 0.6
          ctx.font = `${Math.max(8, size * 3)}px "JetBrains Mono", monospace`
          ctx.fillStyle = n.color
          ctx.textAlign = 'center'
          ctx.fillText(n.label, p.sx, p.sy - size - 6)
        }

        if (size > 2) {
          const grd = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, size * 4)
          grd.addColorStop(0, n.color + '44')
          grd.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, size * 4, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.globalAlpha = depthAlpha * 0.3
          ctx.fill()
        }

        ctx.globalAlpha = 1
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, zIndex: 0,
      pointerEvents: 'none',
    }} />
  )
}
