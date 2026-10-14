import type { FocusEvent, PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { folderPaper } from '@/lib/folderPaper'
import type { WorkFolder } from '@/data/work-folders'
import type { Project } from '@/types'

interface ProjectFolderCardProps {
  project: Project
  folder: WorkFolder
  /** Pointer-following tilt: fine pointers only, and never with reduced motion. */
  interactive: boolean
  /** Registers the preview sheet so the 3D paper layer can align with it. */
  registerSlot: (id: string, element: HTMLElement | null) => void
}

const spring = { stiffness: 100, damping: 20 }
const TILT_Y = 4
const TILT_X = 3

/**
 * A project shown as a paper folder: the title on a raised tab, the cover on a
 * sheet inside, and a shallow front pocket holding the summary and the
 * "View case study" label. The whole folder is a single link named by its
 * title and action; everything else is decoration or description.
 */
export default function ProjectFolderCard({ project, folder, interactive, registerSlot }: ProjectFolderCardProps) {
  const titleId = `folder-${project.id}-title`
  const actionId = `folder-${project.id}-action`
  const summaryId = `folder-${project.id}-summary`
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const tiltX = useSpring(rotateX, spring)
  const tiltY = useSpring(rotateY, spring)
  const cover = folder.cover ?? (project.image ? { src: project.image, alt: project.imageAlt ?? `${project.title} preview` } : null)

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') folderPaper.setHover(project.id, true)
  }
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!interactive || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const py = ((event.clientY - rect.top) / rect.height) * 2 - 1
    rotateY.set(px * TILT_Y)
    rotateX.set(-py * TILT_X)
    folderPaper.setPointer(project.id, px, py)
  }
  const settle = () => {
    rotateX.set(0)
    rotateY.set(0)
    folderPaper.setHover(project.id, false)
  }
  // Keyboard focus lifts the sheets the same way hover does (no tilt).
  const onFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(':focus-visible')) folderPaper.setHover(project.id, true)
  }

  return (
    <Link
      to={`/project/${project.id}`}
      aria-labelledby={`${titleId} ${actionId}`}
      aria-describedby={summaryId}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={settle}
      onFocus={onFocus}
      onBlur={settle}
      className={`folder-card folder-tint-${folder.tint}`}
    >
      <div className="folder-body" aria-hidden="true" />
      <div className="folder-tab">
        <h3 id={titleId} className="m-0 font-display text-lg font-bold leading-[1.15] tracking-tight md:text-xl">
          {project.title}
        </h3>
      </div>

      <div className="folder-inner">
        <div className="folder-stage">
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}>
            <div className="folder-lift relative">
              <div className="folder-sheet folder-sheet-back" aria-hidden="true" />
              <div className="folder-sheet folder-sheet-front" aria-hidden="true" />
              <div ref={(element) => registerSlot(project.id, element)} className="folder-paper">
                {cover && (
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className={`block aspect-video h-auto w-full rounded-[8px] object-cover ${folder.imagePosition ?? 'object-center'}`}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="folder-pocket">
          <svg className="folder-lip" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M0 20 V5 Q0 1 3 1 H37 C42 1 43 8 50 8 C57 8 58 1 63 1 H97 Q100 1 100 5 V20 Z" fill="currentColor" />
            <path
              d="M0 5 Q0 1 3 1 H37 C42 1 43 8 50 8 C57 8 58 1 63 1 H97 Q100 1 100 5"
              fill="none"
              stroke="var(--f-edge)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="flex flex-1 flex-col px-5 pb-5 pt-2.5 sm:px-6">
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--f-label)]">{folder.label}</p>
            <p id={summaryId} className="m-0 mt-2 text-[0.95rem] leading-relaxed text-[color:var(--f-muted)]">
              {folder.summary}
            </p>
            <span id={actionId} className="mt-auto inline-flex items-center gap-2 pt-3.5 font-semibold text-[color:var(--f-cta)]">
              View case study
              <ArrowRight size={16} weight="bold" aria-hidden="true" className="folder-arrow" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
