import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section section-cyber" id="about">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">About</div>
          <h2 className="section__title-alt">{t.about.title}</h2>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className={`animate-fade-up${visible ? ' is-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: 24,
            }}>
              {t.about.p1}
            </p>
          </div>

          <div className={`animate-fade-up${visible ? ' is-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              marginBottom: 40,
            }}>
              {t.about.p2}
            </p>
          </div>

          <div className={`animate-fade-up${visible ? ' is-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <div className="glass-cyber" style={{ padding: '32px 40px', borderLeft: '3px solid var(--accent-purple)' }}>
              <p style={{
                fontStyle: 'italic',
                fontSize: '1.15rem',
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                fontFamily: 'var(--font-mono)',
              }}>
                "{t.about.quote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
