import { useEffect, useRef, useState } from 'react'

const lines = [
  { cmd: '$ whoami', out: 'luca.pugliese' },
  { cmd: '$ cat /etc/skills', out: 'C C++ Python Rust ARM ASM' },
  { cmd: '$ ./configure --stack=full', out: 'checking for STM32... yes' },
  { cmd: '', out: 'checking for KiCad... yes' },
  { cmd: '', out: 'checking for Fusion360... yes' },
  { cmd: '$ make -j4', out: 'Linking embedded engineer... done.' },
  { cmd: '$ echo $STATUS', out: 'Available for consulting' },
  { cmd: '$', out: '' },
]

export default function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [typed, setTyped] = useState<string[]>(lines.map(() => ''))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startSequence()
      },
      { threshold: 0.3 }
    )
    const el = containerRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  const startSequence = () => {
    let lineIdx = 0
    let charIdx = 0

    const typeNext = () => {
      if (lineIdx >= lines.length) return

      const currentCmd = lines[lineIdx].cmd
      if (!currentCmd) {
        setTyped(prev => {
          const next = [...prev]
          next[lineIdx] = ''
          return next
        })
        setVisibleLines(lineIdx + 1)
        lineIdx++
        charIdx = 0
        setTimeout(typeNext, 80)
        return
      }

      if (charIdx <= currentCmd.length) {
        setTyped(prev => {
          const next = [...prev]
          next[lineIdx] = currentCmd.slice(0, charIdx)
          return next
        })
        charIdx++
        setTimeout(typeNext, 30)
      } else {
        setVisibleLines(lineIdx + 1)
        lineIdx++
        charIdx = 0
        setTimeout(typeNext, 400)
      }
    }

    typeNext()
  }

  return (
    <div ref={containerRef} className="code-terminal">
      <div className="code-terminal__header">
        <span className="code-terminal__dot" style={{ background: '#ff5f56' }} />
        <span className="code-terminal__dot" style={{ background: '#ffbd2e' }} />
        <span className="code-terminal__dot" style={{ background: '#27c93f' }} />
        <span className="code-terminal__title">terminal — luca@portfolio: ~</span>
      </div>
      <div className="code-terminal__body">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="code-terminal__line">
            {line.cmd ? (
              <>
                <span className="code-terminal__prompt">$ </span>
                <span className="code-terminal__cmd">{typed[i]}</span>
                {i === visibleLines - 1 && line.cmd && (
                  <span className="code-terminal__cursor" />
                )}
              </>
            ) : (
              <span className="code-terminal__out">{line.out}</span>
            )}
            {!line.cmd && line.out && i < visibleLines - 1 && (
              <span className="code-terminal__out">{line.out}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
