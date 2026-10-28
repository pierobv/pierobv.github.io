import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import type { Project } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useLanguage } from '../i18n/language'
import { ProjectCard } from './ProjectCard'

// Same breakpoint as the wide layout in index.css.
const WIDE = '(min-width: 1100px)'
// How far the finger has to travel for a swipe to count, so a tap on a link isn't a swipe.
const SWIPE_PX = 50

/**
 * The project list. One rule decides everything:
 *   carousel only if there are more projects than fit on screen (1 per view, 2 on wide screens).
 * Otherwise the cards are simply laid out (one, or two side by side), with no arrows.
 */
export function Projects({ projects }: { projects: Project[] }) {
  const { t } = useLanguage()
  const wide = useMediaQuery(WIDE)
  const perView = wide ? 2 : 1
  // On wide screens, a card that shares the row uses the narrow layout.
  const compact = wide && projects.length > 1

  if (projects.length <= perView) {
    return (
      <div className="projects-grid" data-count={projects.length}>
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} compact={compact} />
        ))}
      </div>
    )
  }

  return <Carousel projects={projects} perView={perView} label={t.projectsTitle} />
}

function Carousel({ projects, perView, label }: { projects: Project[]; perView: number; label: string }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(0)
  const swipeStart = useRef<number | null>(null)

  // `index` is the first visible card. The last valid one leaves `perView` cards on screen.
  const maxIndex = projects.length - perView
  // Clamped on every render: resizing from 1 to 2 per view can make the stored index too big.
  const current = Math.min(index, maxIndex)
  const go = (to: number) => setIndex(Math.max(0, Math.min(maxIndex, to)))

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') go(current - 1)
    if (event.key === 'ArrowRight') go(current + 1)
  }

  const handlePointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const distance = event.clientX - swipeStart.current
    swipeStart.current = null
    if (distance <= -SWIPE_PX) go(current + 1)
    if (distance >= SWIPE_PX) go(current - 1)
  }

  // "1 / 4" with one card per view, "1–2 / 4" with two.
  const first = current + 1
  const last = current + perView
  const position = perView === 1 ? `${first}` : `${first}–${last}`

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Controls sit above the cards: the cards can differ in height, so below them the
          arrows would jump around (or end up after an empty gap). */}
      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-button"
          onClick={() => go(current - 1)}
          disabled={current === 0}
          aria-label={t.previousProject}
        >
          ←
        </button>
        <div className="carousel-dots" aria-hidden="true">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <span key={i} className="carousel-dot" data-active={i === current} />
          ))}
        </div>
        <span className="carousel-count" aria-live="polite">
          {position} / {projects.length}
        </span>
        <button
          type="button"
          className="carousel-button"
          onClick={() => go(current + 1)}
          disabled={current === maxIndex}
          aria-label={t.nextProject}
        >
          →
        </button>
      </div>
      <div className="carousel-viewport" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {/* The track slides as a whole; CSS turns --index into a translateX (index.css). */}
        <div
          className="carousel-track"
          style={{ '--index': current, '--per-view': perView, '--at-end': current === maxIndex ? 1 : 0 } as CSSProperties}
        >
          {projects.map((project, i) => {
            const visible = i >= current && i < current + perView
            return (
              <div
                key={project.name}
                className="carousel-slide"
                data-visible={visible}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${projects.length}`}
              >
                {/* `inert` takes off-screen cards out of the Tab order and away from screen readers. */}
                <div className="carousel-card" inert={!visible}>
                  <ProjectCard project={project} compact={perView > 1} />
                </div>
                {/* The card peeking at the edge is clickable and brings itself into view. */}
                {!visible && (
                  <button
                    type="button"
                    className="carousel-peek"
                    aria-label={`${t.showProject}: ${project.name}`}
                    onClick={() => go(i < current ? i : i - perView + 1)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
