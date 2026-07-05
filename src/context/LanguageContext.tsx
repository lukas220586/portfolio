import { createContext, useContext, useState, type ReactNode } from 'react'
import en from '../i18n/en'
import it from '../i18n/it'
import type { Translations } from '../i18n/en'

type Locale = 'en' | 'it'

interface LangCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const Context = createContext<LangCtx>({ locale: 'en', setLocale: () => {}, t: en })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const t = locale === 'en' ? en : it

  return (
    <Context.Provider value={{ locale, setLocale, t }}>
      {children}
    </Context.Provider>
  )
}

export const useLanguage = () => useContext(Context)
