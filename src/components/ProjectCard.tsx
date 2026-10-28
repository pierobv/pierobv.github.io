import type { PointerEvent } from 'react'
import type { Project } from '../data/projects'
import { useLanguage } from '../i18n/language'
import { CountUp } from './CountUp'
import { TerminalDemo } from './TerminalDemo'

// Feeds the pointer position to CSS (--x/--y), which draws a soft light that follows it.
function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`)
}

// `compact`: the card shares the row with another one, so it uses the stacked (narrow) layout
// even on wide screens.
export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { language, t } = useLanguage()

  return (
    <article className={compact ? 'project project--compact' : 'project'} onPointerMove={trackPointer}>
      <header className="project-head">
        <h3 className="project-name">{project.name}</h3>
        <a className="link arrow-link" href={project.url} target="_blank" rel="noreferrer">
          {t.viewOnGithub} <span className="arrow">↗</span>
        </a>
      </header>

      <p className="project-description">{project.description[language]}</p>

      {/* Stacked on small screens; side by side (terminal | numbers) on wide ones (index.css). */}
      <div className="project-body">
        {project.demo && <TerminalDemo demo={project.demo} />}

        <dl className="stats">
          {project.stats.map((stat) => (
            <div key={stat.label.en} className="stat">
              <dt>{stat.label[language]}</dt>
              <dd>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ul className="stack" aria-label="Stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  )
}
