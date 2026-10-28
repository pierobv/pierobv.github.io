export type Language = 'en' | 'pt'

export const LANGUAGES: Language[] = ['en', 'pt']

// English is the source of truth. The Portuguese dictionary is typed as `Dictionary`,
// so a missing or misspelled key is a compile error instead of a blank spot on the page.
const en = {
  role: 'Full-stack Engineer',
  location: 'Udine, Italy',
  intro:
    "I build with C# (.NET), Python and React, and I'm doing an MSc in AI & Cybersecurity. Lately: AI systems that run locally, and measuring whether they work before trusting them.",
  downloadCv: 'Download CV',
  projectsTitle: 'Projects',
  viewOnGithub: 'View on GitHub',
  demoCaption: 'A real run, shortened. Every claim points to the section it came from.',
  experienceTitle: 'Experience',
  contactTitle: 'Contact',
  contactText: 'The best way to reach me is by email.',
  copyEmail: 'Copy',
  copied: 'Copied',
  footerBuilt: 'Built with React & TypeScript',
  switchToLight: 'Bring the sun',
  switchToDark: 'Light the torch',
  navLabel: 'Sections',
  languageLabel: 'Language',
}

export type Dictionary = typeof en

const pt: Dictionary = {
  role: 'Engenheiro Full-stack',
  location: 'Udine, Itália',
  intro:
    'Desenvolvo com C# (.NET), Python e React e faço mestrado em IA e Cibersegurança. Ultimamente: sistemas de IA que rodam localmente, e medir se funcionam antes de confiar neles.',
  downloadCv: 'Baixar CV (inglês)',
  projectsTitle: 'Projetos',
  viewOnGithub: 'Ver no GitHub',
  demoCaption: 'Execução real, resumida. Cada afirmação aponta para a seção de onde veio.',
  experienceTitle: 'Experiência',
  contactTitle: 'Contato',
  contactText: 'A melhor forma de falar comigo é por e-mail.',
  copyEmail: 'Copiar',
  copied: 'Copiado',
  footerBuilt: 'Feito com React e TypeScript',
  switchToLight: 'Trazer o sol',
  switchToDark: 'Acender a tocha',
  navLabel: 'Seções',
  languageLabel: 'Idioma',
}

export const translations: Record<Language, Dictionary> = { en, pt }
