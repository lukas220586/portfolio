import { useEffect, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const { locale, setLocale, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container">
        <a href="#hero" className="navbar__logo">LP</a>

        <div className="navbar__links">
          <a href="#about" className="navbar__link">{t.nav.about}</a>
          <a href="#experience" className="navbar__link">{t.nav.experience}</a>
          <a href="#skills" className="navbar__link">{t.nav.skills}</a>
          <a href="#projects" className="navbar__link">{t.nav.projects}</a>
          <a href="#contact" className="navbar__link">{t.nav.contact}</a>

          <div className="navbar__lang">
            <button
              className={`navbar__lang-btn${locale === 'en' ? ' navbar__lang-btn--active' : ''}`}
              onClick={() => setLocale('en')}
            >
              EN
            </button>
            <button
              className={`navbar__lang-btn${locale === 'it' ? ' navbar__lang-btn--active' : ''}`}
              onClick={() => setLocale('it')}
            >
              IT
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
