import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; alpha: number
  streamOffset: number
}

const STREAM_SPEED = 0.3

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let mouse = { x: -9999, y: -9999 }
    const particles: Particle[] = []
    const COUNT = 80
    const CONNECT_DIST = 130

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 + STREAM_SPEED,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        streamOffset: Math.random() * 100,
      })
    }

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('mouseleave', onLeave)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx + Math.sin(p.y * 0.01 + p.streamOffset) * 0.4
        p.y += p.vy

        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width }
        if (p.x < -20) p.x = canvas.width + 20
        if (p.x > canvas.width + 20) p.x = -20

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x - 2, p.y - 2, p.size * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha * 0.4})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${(1 - dist / CONNECT_DIST) * 0.12})`
            ctx.lineWidth = 0.5 + (1 - dist / CONNECT_DIST)
            ctx.stroke()
          }
        }

        const dx = particles[i].x - mouse.x
        const dy = particles[i].y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECT_DIST * 1.5) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / (CONNECT_DIST * 1.5)) * 0.25})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.addEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, zIndex: 0,
      pointerEvents: 'none', opacity: 0.7,
    }} />
  )
}
