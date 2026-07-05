import { useEffect, useRef } from 'react'

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]|&~!=+-*%$#@'

interface Drop {
  x: number; y: number; speed: number; len: number; chars: string[]
}

export default function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const drops: Drop[] = []
    const FONT_SIZE = 14
    const FADE_HEIGHT = 0.6

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drops.length = 0
      const cols = Math.floor(canvas.width / FONT_SIZE)
      for (let i = 0; i < cols; i++) {
        const len = Math.floor(Math.random() * 15 + 5)
        drops.push({
          x: i * FONT_SIZE,
          y: Math.random() * canvas.height * -1,
          speed: Math.random() * 0.8 + 0.3,
          len,
          chars: Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]),
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 14, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const d of drops) {
        for (let i = 0; i < d.chars.length; i++) {
          const yPos = d.y - i * FONT_SIZE
          if (yPos < 0 || yPos > canvas.height) continue

          const alpha = 1 - (i / d.chars.length) * FADE_HEIGHT
          const isHead = i === 0

          ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`
          ctx.fillStyle = isHead
            ? `rgba(124, 58, 237, ${alpha})`
            : `rgba(59, 130, 246, ${alpha * 0.6})`
          ctx.fillText(d.chars[i], d.x, yPos)
        }

        d.y += d.speed * FONT_SIZE * 0.8

        if (d.y - d.chars.length * FONT_SIZE > canvas.height) {
          d.y = 0
          d.chars = Array.from({ length: d.len }, () => chars[Math.floor(Math.random() * chars.length)])
          d.speed = Math.random() * 0.8 + 0.3
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, zIndex: 0,
      opacity: 0.15, pointerEvents: 'none',
    }} />
  )
}
