import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled with the site (Fontsource) instead of loaded from Google Fonts:
// no request to a third party, and they work offline in development.
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import App from './App'
import { LanguageProvider } from './i18n/LanguageProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
