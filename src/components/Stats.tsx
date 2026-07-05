import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useState } from 'react'

interface StatBoxProps {
  value: number
  suffix: string
  label: string
  icon: string
}

function StatBox({ value, suffix, label, icon }: StatBoxProps) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  useEffect(() => {
    if (!visible) return
    let current = 0
    const step = Math.ceil(value / 40)
    const timer = setInterval(() => {
      current += step
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [visible, value])

  return (
    <div ref={ref} className="stat-card">
      <div style={{
        fontSize: '1.5rem', marginBottom: 12, fontFamily: 'var(--font-mono)',
      }}>{icon}</div>
      <div className="stat-card__number">{count}{suffix}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}

const stats = [
  { value: 20, suffix: '+', label: 'Years of Experience', icon: '⚡' },
  { value: 24, suffix: '', label: 'Engineering Projects', icon: '🔧' },
  { value: 10, suffix: '', label: 'Skill Domains', icon: '🧠' },
  { value: 7, suffix: '', label: 'Technical Categories', icon: '⚙️' },
]

export default function Stats() {
  return (
    <section className="section section-cyber" id="stats">
      <div className="container">
        <div className="stats-grid">
          {stats.map(s => <StatBox key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  )
}
