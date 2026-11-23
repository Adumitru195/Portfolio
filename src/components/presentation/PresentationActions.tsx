import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, DownloadSimple } from '@phosphor-icons/react'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { usePresentationTheme } from '@/lib/presentationTheme'

interface PresentationActionsProps {
  pdf?: { href: string; label: string; detail: string }
  /**
   * Optional "Start a project" action. It links to the homepage Contact
   * section, like the main navigation's button. Pages that don't pass it are
   * unchanged.
   */
  contactLabel?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-3.5 font-semibold transition-[color,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

// Closing actions: start a project (when offered), download the case study PDF
// (when one is current), and return to the Work section.
export default function PresentationActions({ pdf, contactLabel }: PresentationActionsProps) {
  const theme = usePresentationTheme()
  // The first action shown is the primary one.
  const workIsPrimary = !pdf && !contactLabel
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {contactLabel && (
        <Link to="/" state={{ scrollTo: 'contact' }} className={`${base} ${theme.buttonPrimary}`}>
          {contactLabel}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      )}
      {pdf && (
        <a href={pdf.href} download className={`${base} ${contactLabel ? theme.buttonSecondary : theme.buttonPrimary}`}>
          <DownloadSimple size={18} aria-hidden="true" />
          {pdf.label}
          <span className="font-normal">({pdf.detail})</span>
        </a>
      )}
      <Link to={workLink} state={workState} className={`${base} ${workIsPrimary ? theme.buttonPrimary : theme.buttonSecondary}`}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Work
      </Link>
    </div>
  )
}
