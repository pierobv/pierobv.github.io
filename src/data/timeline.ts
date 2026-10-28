import type { Language } from '../i18n/translations'

type Localized = Record<Language, string>

export type TimelineItem = {
  period: string
  title: Localized
  org: string
  orgUrl: string // the company's LinkedIn page
  place: Localized
}

// Short on purpose: one line per job. The details are in the CV (Piero_Volpato_CV_2026.pdf).
export const experience: TimelineItem[] = [
  {
    period: '2024',
    title: { en: 'Full-stack Developer', pt: 'Desenvolvedor Full-stack' },
    org: 'Servizi CGN',
    orgUrl: 'https://www.linkedin.com/company/servizi-cgn-societa-benefit/',
    place: { en: 'Pordenone, Italy', pt: 'Pordenone, Itália' },
  },
  {
    period: '2022',
    title: { en: 'Backend Developer (Intern)', pt: 'Desenvolvedor Backend (estágio)' },
    org: 'Bidweb Security IT',
    orgUrl: 'https://www.linkedin.com/company/bidweb-security-it/',
    place: { en: 'Recife, Brazil', pt: 'Recife, Brasil' },
  },
]
