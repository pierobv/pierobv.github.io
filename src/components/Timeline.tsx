import type { TimelineItem } from '../data/timeline'
import { useLanguage } from '../i18n/language'

export function Timeline({ items }: { items: TimelineItem[] }) {
  const { language } = useLanguage()

  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.org} className="timeline-item">
          <span className="timeline-period">{item.period}</span>
          <span className="timeline-title">{item.title[language]}</span>
          <span className="timeline-org">
            {item.org} · {item.place[language]}
          </span>
        </li>
      ))}
    </ol>
  )
}
