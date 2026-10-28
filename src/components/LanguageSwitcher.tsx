import type { ReactNode } from 'react'
import { useLanguage } from '../i18n/language'
import type { Language } from '../i18n/translations'
import { BrazilFlag, UkFlag } from './Flags'

const options: { value: Language; label: string; flag: ReactNode }[] = [
  { value: 'en', label: 'English', flag: <UkFlag /> },
  { value: 'pt', label: 'Português', flag: <BrazilFlag /> },
]

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="lang-switcher" role="group" aria-label={t.languageLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="flag-button"
          // aria-pressed tells assistive tech which language is active; CSS uses it for the style too.
          aria-pressed={language === option.value}
          aria-label={option.label}
          title={option.label}
          onClick={() => setLanguage(option.value)}
        >
          {option.flag}
        </button>
      ))}
    </div>
  )
}
