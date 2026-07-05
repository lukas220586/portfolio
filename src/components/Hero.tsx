import { useLanguage } from '../context/LanguageContext'
import { useTypewriter } from '../hooks/useTypewriter'
import TechHero from './TechHero'

const roles = [
  'Senior Embedded & Hardware Engineer',
  'Firmware Engineer (STM32 / ESP32)',
  'PCB Designer (KiCad / Altium)',
  'Reverse Engineer',
  'CNC / Laser / 3DP Specialist',
  'Industrial Automation Engineer',
  'Audio Electronics Engineer',
]

const rolesIt = [
  'Ingegnere Embedded & Hardware Senior',
  'Ingegnere Firmware (STM32 / ESP32)',
  'Progettista PCB (KiCad / Altium)',
  'Reverse Engineer',
  'Specialista CNC / Laser / 3DP',
  'Ingegnere Automazione Industriale',
  'Ingegnere Elettronica Audio',
]

export default function Hero() {
  const { t, locale } = useLanguage()
  const roleText = useTypewriter(locale === 'it' ? rolesIt : roles, 70, 35, 2000)

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <TechHero />

      <div className="hero__scanline" />

      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          {t.hero.badge}
        </div>

        <h1 className="hero__name">
          {t.hero.name}
        </h1>

        <div className="hero__role">
          <div className="hero__role-box">
            <span className="hero__prompt">λ </span>
            <span className="hero__typewriter">{roleText}</span>
            <span className="hero__cursor" />
          </div>
        </div>

        <div className="hero__cta">
          <button className="btn btn--primary" onClick={() => scrollTo('#projects')}>
            {t.hero.cta}
          </button>
          <button className="btn btn--outline" onClick={() => scrollTo('#contact')}>
            {t.hero.contact}
          </button>
        </div>
      </div>

      <div className="hero__scroll-hint">
        <span className="hero__scroll-text">SCROLL</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
