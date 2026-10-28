import type { Project } from './projects'

/**
 * Fake projects for testing the carousel in development only.
 * Open http://localhost:5173/?cards=4 to see 4 cards (the real one + 3 placeholders).
 *
 * This file only ever runs behind `import.meta.env.DEV` (see withPlaceholders). Vite turns that
 * into `false` in the production build and drops the branch, so none of this reaches the site.
 */
function placeholder(n: number): Project {
  return {
    name: `placeholder-${n}`,
    url: 'https://github.com/pierobv',
    description: {
      en: `Placeholder project #${n}, here only to test how several cards look side by side. It never shows up in production.`,
      pt: `Projeto de exemplo nº ${n}, só para testar como vários cards ficam lado a lado. Nunca aparece em produção.`,
    },
    stats: [
      { value: 10 * n, suffix: '%', label: { en: 'example metric', pt: 'métrica de exemplo' } },
      { value: n, label: { en: 'another number', pt: 'outro número' } },
      { value: 100 - n, suffix: '%', label: { en: 'one more', pt: 'mais um' } },
    ],
    stack: ['Python', 'TypeScript', 'Ollama'],
  }
}

// Total number of cards comes from ?cards=N (the real projects count towards it).
export function withPlaceholders(projects: Project[]): Project[] {
  const wanted = Number(new URLSearchParams(location.search).get('cards'))
  if (!Number.isInteger(wanted) || wanted <= projects.length) return projects
  const extra = Array.from({ length: wanted - projects.length }, (_, i) => placeholder(i + 2))
  return [...projects, ...extra]
}
