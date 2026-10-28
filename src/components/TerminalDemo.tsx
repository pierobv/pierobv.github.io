import { useEffect, useRef, useState } from 'react'
import type { Demo } from '../data/projects'
import { useLanguage } from '../i18n/language'
import { prefersReducedMotion } from '../motion'

const TYPE_MS = 22 // per character of the command
const PAUSE_MS = 450 // "thinking" between the command and the answer

// Paints the [n] citation markers in the accent color.
function withCitations(text: string) {
  return text.split(/(\[\d+\])/).map((part, i) =>
    /^\[\d+\]$/.test(part) ? (
      <span key={i} className="terminal-cite">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/**
 * A terminal that types the command and then shows the answer, once, when it scrolls
 * into view. Screen readers get the full text right away (sr-only); the animated part is
 * hidden from them so they don't hear it letter by letter.
 */
export function TerminalDemo({ demo }: { demo: Demo }) {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement>(null)
  const reduced = prefersReducedMotion()
  const [typed, setTyped] = useState(reduced ? demo.command.length : 0)
  const [answered, setAnswered] = useState(reduced)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        let count = 0
        const type = () => {
          count += 1
          setTyped(count)
          if (count < demo.command.length) timer = window.setTimeout(type, TYPE_MS)
          else timer = window.setTimeout(() => setAnswered(true), PAUSE_MS)
        }
        type()
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [demo.command, reduced])

  return (
    <figure className="terminal" ref={ref}>
      <div className="terminal-bar" aria-hidden="true">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
      </div>
      <div className="terminal-body" aria-hidden="true">
        <p>
          <span className="terminal-prompt">$</span> {demo.command.slice(0, typed)}
          {!answered && <span className="terminal-cursor" />}
        </p>
        {answered && (
          <div className="terminal-output">
            <p>{withCitations(demo.answer)}</p>
            <ul>
              {demo.sources.map((source) => (
                <li key={source}>{withCitations(source)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="sr-only">
        <p>$ {demo.command}</p>
        <p>{demo.answer}</p>
        <ul>
          {demo.sources.map((source) => (
            <li key={source}>{source}</li>
          ))}
        </ul>
      </div>
      <figcaption>{t.demoCaption}</figcaption>
    </figure>
  )
}
