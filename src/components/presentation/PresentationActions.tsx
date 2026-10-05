import { Link } from 'react-router-dom'
import { ArrowLeft, DownloadSimple } from '@phosphor-icons/react'
import { workLink, workState } from '@/components/presentation/PresentationOpening'
import { usePresentationTheme } from '@/lib/presentationTheme'

interface PresentationActionsProps {
  pdf?: { href: string; label: string; detail: string }
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-3.5 font-semibold transition-[color,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

// Closing actions: download the case study PDF (when one is current), or return to the Work section.
export default function PresentationActions({ pdf }: PresentationActionsProps) {
  const theme = usePresentationTheme()
  return (
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {pdf && (
        <a href={pdf.href} download className={`${base} ${theme.buttonPrimary}`}>
          <DownloadSimple size={18} aria-hidden="true" />
          {pdf.label}
          <span className="font-normal">({pdf.detail})</span>
        </a>
      )}
      <Link to={workLink} state={workState} className={`${base} ${pdf ? theme.buttonSecondary : theme.buttonPrimary}`}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Work
      </Link>
    </div>
  )
}
