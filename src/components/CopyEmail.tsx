import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/language'

export function CopyEmail({ email }: { email: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  // The "Copied" label goes back to "Copy" after a moment.
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // Clipboard blocked (old browser or insecure context): open the mail client instead.
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <button type="button" className="chip-button" data-copied={copied} onClick={copy}>
      {/* aria-live makes screen readers announce the change to "Copied". */}
      <span aria-live="polite">{copied ? t.copied : t.copyEmail}</span>
    </button>
  )
}
