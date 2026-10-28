import { createContext, useContext } from 'react'
import type { Dictionary, Language } from './translations'

export type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)

// Throwing here turns "forgot the provider" into a clear error instead of `undefined` deep in the UI.
export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return value
}
