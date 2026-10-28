import { useEffect, useState, type ReactNode } from 'react'
import { LanguageContext } from './language'
import { LANGUAGES, translations, type Language } from './translations'

const STORAGE_KEY = 'lang'

// Order: the visitor's own choice (saved) > browser in any Portuguese (pt-BR, pt-PT, pt) > English.
// Any other browser language, Italian or Spanish included, always gets English.
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGUAGES.includes(saved as Language)) return saved as Language
  } catch {
    // Private mode or blocked storage: decide from the browser below.
  }
  // `languages` is the visitor's ordered preference list; we look at the first one only,
  // so someone with "en-US, pt-BR" still gets English.
  const preferred = navigator.languages?.[0] ?? navigator.language
  return preferred?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  useEffect(() => {
    // Screen readers and the browser's translator read <html lang>.
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
  }, [language])

  // Saved only when the visitor clicks a flag. Saving the automatic default would freeze it,
  // and a later change in the browser language would be ignored.
  const setLanguage = (next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not saving is fine; the choice still holds for this visit.
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}
