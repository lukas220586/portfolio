import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLanguage } from '../context/LanguageContext'
import CodeTerminal from './CodeTerminal'

const socials = [
  { label: 'GitHub', url: 'https://github.com/lukas220586', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/lukas220586', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'Email', url: 'mailto:lukas220586@gmail.com', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', polyline: '22,6 12,13 2,6' },
]

export default function Contact() {
  const { t } = useLanguage()
  const { ref, visible } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="section section-cyber" id="contact">
      <div className="container">
        <div ref={ref} className={`section__header animate-fade-up${visible ? ' is-visible' : ''}`}>
          <div className="section__subtitle-alt">Connect</div>
          <h2 className="section__title-alt">{t.contact.title}</h2>
          <p className="section__subtitle">{t.contact.desc}</p>
        </div>

        <div className="contact-grid">
          <div className={`animate-fade-left${visible ? ' is-visible' : ''}`}>
            <div className="glass-cyber" style={{ padding: 32 }}>
              <form onSubmit={e => {
                e.preventDefault()
                const f = e.currentTarget
                const name = (f.querySelector('[name=name]') as HTMLInputElement).value
                const email = (f.querySelector('[name=email]') as HTMLInputElement).value
                const subject = (f.querySelector('[name=subject]') as HTMLInputElement).value
                const message = (f.querySelector('[name=message]') as HTMLTextAreaElement).value
                const body = `From: ${name} (${email})\n\n${message}`
                window.location.href = `mailto:lukas220586@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}>
                <div className="form-group">
                  <input type="text" name="name" placeholder={t.contact.name} className="form-input" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder={t.contact.email} className="form-input" required />
                </div>
                <div className="form-group">
                  <input type="text" name="subject" placeholder={t.contact.subject} className="form-input" />
                </div>
                <div className="form-group">
                  <textarea name="message" placeholder={t.contact.message} className="form-input" required />
                </div>
                <button type="submit" className="btn btn--primary">
                  {t.contact.send}
                </button>
              </form>
            </div>
          </div>

          <div className={`animate-fade-right${visible ? ' is-visible' : ''}`}>
            <div className="glass-cyber" style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>
                {t.contact.connected}
              </h3>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 24, lineHeight: 1.7 }}>
                {t.contact.connectedDesc}
              </p>

              <div className="social-links">
                {socials.map(s => (
                  <a key={s.label} className="social-link" href={s.url} target="_blank" rel="noopener" aria-label={s.label}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={s.polyline ? 'none' : 'currentColor'} stroke={s.polyline ? 'currentColor' : undefined} strokeWidth={s.polyline ? 2 : undefined} strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.path} />
                      {s.polyline && <polyline points={s.polyline} />}
                    </svg>
                  </a>
                ))}
              </div>

              <CodeTerminal />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
