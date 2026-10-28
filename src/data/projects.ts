import type { Language } from '../i18n/translations'

// Text that changes with the language. Names, numbers and tech stay the same in both.
type Localized = Record<Language, string>

export type Stat = {
  value: number
  suffix?: string
  label: Localized
}

// A terminal session shown in the card. Copied from a real run (grounded-rag's README),
// only shortened: the tool's output is not translated.
export type Demo = {
  command: string
  answer: string
  sources: string[]
}

export type Project = {
  name: string
  url: string
  description: Localized
  demo?: Demo
  stats: Stat[]
  stack: string[]
}

// To add a project (e.g. triage-agent once it's public), append one object here.
export const projects: Project[] = [
  {
    name: 'grounded-rag',
    url: 'https://github.com/pierobv/grounded-rag',
    description: {
      en: 'Local question answering over the OWASP Cheat Sheets. Every answer cites the section it came from, and it says "I don\'t know" when the documents don\'t have the answer. No LangChain: chunking, hybrid search, rank fusion and metrics are written by hand.',
      pt: 'Perguntas e respostas locais sobre os OWASP Cheat Sheets. Toda resposta cita a seção de onde veio, e ele diz "não sei" quando os documentos não têm a resposta. Sem LangChain: chunking, busca híbrida, fusão de rankings e métricas foram escritos à mão.',
    },
    demo: {
      command: 'grounded-rag ask "How do I stop other sites from embedding my pages in an iframe?"',
      answer:
        'You can use the `X-Frame-Options` header or the `frame-ancestors` directive in a Content Security Policy (CSP) to stop other sites from embedding your pages in an iframe [1][2][4].',
      sources: [
        '[1] Clickjacking Defense Cheat Sheet › Defending with X-Frame-Options Response Headers',
        '[2] Clickjacking Defense Cheat Sheet › Defending with Content Security Policy (CSP) frame-ancestors directive',
        '[4] Cross-site leaks Cheat Sheet › … › Defense › Framing protection',
      ],
    },
    stats: [
      {
        value: 95,
        suffix: '%',
        label: { en: 'recall@5 on 101 hand-reviewed questions', pt: 'recall@5 em 101 perguntas revisadas à mão' },
      },
      {
        value: 19,
        label: { en: 'experiments with confidence intervals', pt: 'experimentos com intervalos de confiança' },
      },
      {
        value: 90,
        suffix: '%',
        label: { en: 'of out-of-corpus questions refused', pt: 'das perguntas fora do corpus recusadas' },
      },
    ],
    stack: ['Python', 'Ollama', 'Chroma', 'BM25', 'Cross-encoder', 'Pydantic', 'FastAPI', 'pytest'],
  },
]
