import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { projects } from '@/data/projects'
import { workFolders } from '@/data/work-folders'
import { moreWork, workSection } from '@/data/work'
import AccentLine from '@/components/AccentLine'
import FeaturedProject from '@/components/work/FeaturedProject'
import ProjectFolderCard from '@/components/work/ProjectFolderCard'
import FolderPaperLayer from '@/components/work/FolderPaperLayer'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'
import { useReveal } from '@/hooks/useReveal'

// The folder gallery: every project except the featured one, in the order
// set in data/work.ts.
const folders = moreWork.order.flatMap((id) => {
  const project = projects.find((p) => p.id === id)
  const folder = workFolders[id]
  return project && folder ? [{ project, folder }] : []
})
const sceneCards = folders.map(({ project, folder }) => ({ id: project.id, tint: folder.tint }))

/**
 * "Selected work": an editorial header, the featured Backwater Journal
 * presentation, then the other projects as folders. The gallery opens with a
 * short introduction in its first cell, so five folders and the intro fill
 * even rows at two and three columns.
 */
export default function Work() {
  const headerReveal = useReveal({ once: true, margin: '-10% 0px' })
  const galleryReveal = useReveal({ once: true, margin: '-10% 0px' })
  const gridRef = useRef<HTMLDivElement>(null)
  const slots = useRef(new Map<string, HTMLElement>())
  const [paper3d, setPaper3d] = useState(false)
  const reducedMotion = useReducedMotionPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  const registerSlot = useCallback((id: string, element: HTMLElement | null) => {
    if (element) slots.current.set(id, element)
    else slots.current.delete(id)
  }, [])

  return (
    <section id="work" aria-labelledby="work-heading" className="section-space px-6 md:px-10">
      <div className="content-wide">
        <motion.header
          variants={staggerContainer}
          {...headerReveal}
          className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12"
        >
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <AccentLine />
              <p className="text-xs font-medium uppercase tracking-widest text-text-secondary">{workSection.label}</p>
            </div>
            <h2
              id="work-heading"
              className="mt-6 font-display text-[clamp(2.5rem,1.3rem+3.6vw,4.75rem)] font-black leading-[1.02] tracking-[-0.03em] text-text-primary"
            >
              {workSection.heading.map((line, i) => (
                <span key={line} className={`block ${i === workSection.heading.length - 1 ? 'text-gradient' : ''}`}>
                  {line}
                </span>
              ))}
            </h2>
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="max-w-[30rem] text-pretty text-base leading-relaxed text-text-secondary md:text-lg lg:col-span-4 lg:col-start-9 lg:self-end"
          >
            {workSection.intro}
          </motion.p>
        </motion.header>

        <div className="mt-12 md:mt-16 lg:mt-20">
          <FeaturedProject />
        </div>

        {/* The folders render immediately as HTML and CSS. The decorative 3D
            paper layer, when it loads, sits between the folder backs and their
            contents, so the gallery is its own stacking context. Columns and
            spacing come from .folder-grid in index.css. */}
        <div ref={gridRef} className="relative isolate mt-20 md:mt-24 lg:mt-28" data-paper={paper3d ? '3d' : 'css'}>
          <FolderPaperLayer gridRef={gridRef} slots={slots} cards={sceneCards} onActiveChange={setPaper3d} />
          <div className="folder-grid">
            <motion.div variants={staggerContainer} {...galleryReveal} className="folder-grid-intro">
              <motion.p variants={fadeUp} className="text-xs font-medium uppercase tracking-widest text-text-secondary">
                {moreWork.label}
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-[24rem] text-pretty font-display text-2xl font-bold leading-snug tracking-[-0.01em] text-text-primary md:text-[1.75rem]"
              >
                {moreWork.intro}
              </motion.p>
            </motion.div>
            <ul role="list" className="contents">
              {folders.map(({ project, folder }) => (
                <li key={project.id}>
                  <ProjectFolderCard
                    project={project}
                    folder={folder}
                    interactive={finePointer && !reducedMotion}
                    registerSlot={registerSlot}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
