import { useEffect, useRef, type MouseEvent } from 'react'
import { CopyEmail } from './components/CopyEmail'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { Projects } from './components/Projects'
import { ThemeSwitch } from './components/ThemeSwitch'
import { Timeline } from './components/Timeline'
import { withPlaceholders } from './data/placeholderProjects'
import { projects } from './data/projects'
import { experience } from './data/timeline'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'
import { useLanguage } from './i18n/language'
import { prefersReducedMotion } from './motion'

const EMAIL = 'pierobvdev@gmail.com'

const profiles = [
  { label: 'GitHub', href: 'https://github.com/pierobv' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pierobv' },
]

// In development, ?cards=N fills the list with placeholder projects to test the carousel.
// In the production build import.meta.env.DEV is the constant `false`, so this is just `projects`.
const visibleProjects = import.meta.env.DEV ? withPlaceholders(projects) : projects

// Menu entries. `titleKey` is typed as a key of the dictionary, so a typo doesn't compile.
const sections: { id: string; titleKey: 'projectsTitle' | 'experienceTitle' | 'contactTitle' }[] = [
  { id: 'projects', titleKey: 'projectsTitle' },
  { id: 'experience', titleKey: 'experienceTitle' },
  { id: 'contact', titleKey: 'contactTitle' },
]

// Computed once when the page loads: render functions should not read the clock.
const year = new Date().getFullYear()

// The logo's href is #top, which is the sticky header. A sticky element always looks "already
// in view", so the browser often scrolled only a little or not at all. We scroll to 0 ourselves
// and drop the hash from the URL; the href stays for middle-click / no-JS.
function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  history.replaceState(null, '', location.pathname + location.search)
}

export default function App() {
  const { language, t } = useLanguage()
  const mainRef = useRef<HTMLElement>(null)
  const previousLanguage = useRef(language)

  useRevealOnScroll()

  // A link like pierobv.github.io/#projects: the browser tries to scroll to #projects before
  // React has rendered it, finds nothing and stays at the top. So we do it once, after the render.
  useEffect(() => {
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView()
  }, [])

  // A short blur-and-fade when the language changes, so the text swap doesn't feel like a glitch.
  // Comparing with the previous value (instead of a "first render" flag) also survives
  // StrictMode, which runs effects twice in development.
  useEffect(() => {
    if (previousLanguage.current === language) return
    previousLanguage.current = language
    if (prefersReducedMotion()) return
    mainRef.current?.animate(
      [
        { opacity: 0.2, filter: 'blur(4px)' },
        { opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: 450, easing: 'ease-out' },
    )
  }, [language])

  return (
    <>
      {/* Sticky: stays at the top while the page scrolls. The torch / sun sits over its center. */}
      <header className="topbar" id="top">
        <div className="topbar-inner">
          <a className="logo" href="#top" onClick={scrollToTop}>
            pierobv
          </a>
          <nav className="topbar-nav" aria-label={t.navLabel}>
            <ul className="nav-links">
              {sections.map((section) => (
                <li key={section.id}>
                  <a className="link" href={`#${section.id}`}>
                    {t[section.titleKey]}
                  </a>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <ThemeSwitch />

      <div className="page">
        <main ref={mainRef}>
          {/* Each direct child of .hero enters with a small delay after the previous one (index.css). */}
          <section className="hero">
            <h1>Piero Volpato</h1>
            <p className="role">
              {t.role} <span className="role-dot" aria-hidden="true" /> {t.location}
            </p>
            <p className="intro">{t.intro}</p>
            <div className="hero-actions">
              {/* `download` saves the file instead of opening it; the PDF lives in public/, served as is. */}
              <a className="button" href="/Piero_Volpato_CV_2026.pdf" download>
                {t.downloadCv} <span className="arrow-down">↓</span>
              </a>
              {profiles.map((profile) => (
                <a key={profile.href} className="link arrow-link" href={profile.href} target="_blank" rel="noreferrer">
                  {profile.label} <span className="arrow">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="section" id="projects" aria-labelledby="projects-title" data-reveal>
            <h2 className="section-title" id="projects-title">
              {t.projectsTitle}
            </h2>
            <Projects projects={visibleProjects} />
          </section>

          <section className="section" id="experience" aria-labelledby="experience-title" data-reveal>
            <h2 className="section-title" id="experience-title">
              {t.experienceTitle}
            </h2>
            <Timeline items={experience} />
          </section>

          <section className="section" id="contact" aria-labelledby="contact-title" data-reveal>
            <h2 className="section-title" id="contact-title">
              {t.contactTitle}
            </h2>
            <p className="contact-text">{t.contactText}</p>
            <div className="contact-row">
              <a className="link email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <CopyEmail email={EMAIL} />
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>© {year} Piero Volpato</span>
          <span>{t.footerBuilt}</span>
        </footer>
      </div>
    </>
  )
}
