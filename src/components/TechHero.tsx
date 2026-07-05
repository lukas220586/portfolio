import { useEffect, useRef } from 'react'

const DOMAINS = [
  { label: 'EMBEDDED', color: '#7c3aed', items: ['STM32', 'ESP32', 'FreeRTOS', 'ARM'] },
  { label: 'FIRMWARE', color: '#3b82f6', items: ['C/C++', 'Bootloader', 'BSP', 'Driver'] },
  { label: 'PCB', color: '#06b6d4', items: ['KiCad', 'Altium', '2-4L', 'LTspice'] },
  { label: 'REVERSE', color: '#ec4899', items: ['Ghidra', 'JTAG', 'UEFI', 'NVRAM'] },
  { label: 'AUDIO', color: '#10b981', items: ['Class AB/D', 'DSP', 'THD', 'Crossover'] },
  { label: 'AUTOMATION', color: '#f59e0b', items: ['Modbus', 'CAN', 'PLC', 'SCADA'] },
  { label: 'FAB', color: '#ef4444', items: ['CNC', '3DP', 'Laser', 'Fusion360'] },
]

interface Token {
  x: number; y: number
  text: string; color: string
  speed: number; life: number; maxLife: number
  size: number
}

export default function TechHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let progress = 0
    let tokens: Token[] = []
    let frame = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => {
      const scrollY = window.scrollY
      const wh = window.innerHeight
      // progress 0→1 over first 2 viewport heights
      const raw = scrollY / (wh * 1.5)
      progress = Math.min(1, Math.max(0, raw))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    function spawnTokens(count: number) {
      const W = canvas.width, H = canvas.height
      for (let i = 0; i < count; i++) {
        const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
        const item = domain.items[Math.floor(Math.random() * domain.items.length)]
        tokens.push({
          x: Math.random() * W,
          y: -20 - Math.random() * 100,
          text: item,
          color: domain.color,
          speed: 0.3 + Math.random() * 0.8,
          life: 1,
          maxLife: 300 + Math.random() * 400,
          size: 10 + Math.random() * 14,
        })
      }
    }

    spawnTokens(40)

    function draw() {
      const W = canvas.width, H = canvas.height
      frame++

      ctx.clearRect(0, 0, W, H)

      // ── hex rain ──
      const hexAlpha = 0.04 + progress * 0.03
      ctx.font = '10px monospace'
      for (let i = 0; i < 60; i++) {
        const x = (i * 31 + frame * 2) % W
        const y = (i * 17 + frame * 3 * (0.5 + (i % 3) * 0.3)) % (H * 1.5) - H * 0.25
        const hex = '0123456789ABCDEF'[Math.floor(Math.random() * 16)]
        ctx.fillStyle = `rgba(124, 58, 237, ${hexAlpha})`
        ctx.fillText(hex, x, y)
      }

      // ── tokens ──
      for (let i = tokens.length - 1; i >= 0; i--) {
        const t = tokens[i]
        t.y += t.speed * (1 + progress * 0.5)
        t.life -= 1 / t.maxLife
        if (t.life <= 0 || t.y > H + 50) {
          tokens.splice(i, 1)
          continue
        }
        const a = Math.min(1, t.life * 2)
        ctx.save()
        ctx.globalAlpha = a * 0.15
        ctx.font = `${t.size}px "JetBrains Mono", monospace`
        ctx.fillStyle = t.color
        ctx.fillText(t.text, t.x, t.y)
        ctx.restore()
      }

      // ── domain hexagons ──
      const CX = W / 2, CY = H / 2
      const radius = 120 + progress * 60
      const time = frame / 200

      for (let i = 0; i < DOMAINS.length; i++) {
        const d = DOMAINS[i]
        const angle = (i / DOMAINS.length) * Math.PI * 2 + time
        const x = CX + Math.cos(angle) * radius
        const y = CY + Math.sin(angle) * radius * 0.6
        const size = 40 + Math.sin(time * 2 + i) * 5

        // glow line from center
        ctx.beginPath()
        ctx.moveTo(CX, CY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `${d.color}22`
        ctx.lineWidth = 1
        ctx.stroke()

        // hexagon
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(time + i)
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const a = (j / 6) * Math.PI * 2 - Math.PI / 2
          const px = Math.cos(a) * size
          const py = Math.sin(a) * size
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fillStyle = `${d.color}15`
        ctx.fill()
        ctx.strokeStyle = `${d.color}44`
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()

        // label
        ctx.fillStyle = d.color
        ctx.font = '9px "JetBrains Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(d.label, x, y + 4)

        // glow dot
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = d.color
        ctx.shadowColor = d.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // ── center pulse ──
      const pulse = Math.sin(time * 2) * 0.3 + 0.7
      ctx.beginPath()
      ctx.arc(CX, CY, 15 + pulse * 5, 0, Math.PI * 2)
      const grd = ctx.createRadialGradient(CX, CY, 0, CX, CY, 25)
      grd.addColorStop(0, `rgba(124, 58, 237, ${0.4 * pulse})`)
      grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd
      ctx.fill()

      // ── scroll-driven distortion ──
      if (progress > 0) {
        const warp = progress * 20
        ctx.fillStyle = `rgba(124, 58, 237, ${progress * 0.03})`
        for (let i = 0; i < 3; i++) {
          const wx = CX + Math.sin(frame / 100 + i * 2) * warp
          const wy = CY + Math.cos(frame / 80 + i * 3) * warp * 0.5
          ctx.beginPath()
          ctx.arc(wx, wy, 50 + progress * 30, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="tech-hero-canvas" />
  )
}
