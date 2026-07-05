import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const dotColors = ['#7c3aed', '#3b82f6', '#10b981']

export default function Experience() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section section-cyber" id="experience">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">Career</div>
          <h2 className="section__title-alt">{t.experience.title}</h2>
          <p className="section__subtitle">{t.experience.desc}</p>
        </div>

        <div className="timeline">
          {t.experience.items.map((exp, i) => (
            <div key={exp.role} className={`timeline__item animate-fade-left${visible ? ' is-visible' : ''}`}
              style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="timeline__dot" style={{
                background: dotColors[i],
                boxShadow: `0 0 0 3px ${dotColors[i]}33, 0 0 20px ${dotColors[i]}44`,
              }} />
              <div className="timeline__date">{exp.period}</div>
              <div className="timeline__role">{exp.role}</div>
              <div className="timeline__company">{exp.company} · <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: dotColors[i],
              }}>{exp.tag}</span></div>
              <div className="timeline__desc">{exp.description}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {exp.highlights.map(h => (
                  <span key={h} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    borderRadius: 6,
                    background: `${dotColors[i]}12`,
                    border: `1px solid ${dotColors[i]}22`,
                    color: dotColors[i],
                    boxShadow: `0 0 12px ${dotColors[i]}11`,
                  }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
