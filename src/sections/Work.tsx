import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { projects } from '@/data/projects'
import { workFolders } from '@/data/work-folders'
import AccentLine from '@/components/AccentLine'
import ProjectFolderCard from '@/components/work/ProjectFolderCard'
import FolderPaperLayer from '@/components/work/FolderPaperLayer'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotionPreference } from '@/hooks/useReducedMotionPreference'

// Projects with folder copy, in projects.ts order.
const folders = projects.flatMap((project) => {
  const folder = workFolders[project.id]
  return folder ? [{ project, folder }] : []
})
const sceneCards = folders.map(({ project, folder }) => ({ id: project.id, tint: folder.tint }))

export default function Work() {
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
    <section id="work" className="px-6 md:px-10 section-space">
      {/* Below 1280px the header sits above the folders; from 1280px it becomes
          a narrow column beside them, like "How I can help". */}
      <div className="content-wide grid grid-cols-1 xl:grid-cols-12 xl:gap-x-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="xl:col-span-3"
        >
          <div className="xl:sticky xl:top-28">
            {/* Section header */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AccentLine />
                <span className="text-xs text-text-muted uppercase tracking-widest">Selected Work</span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-text-primary">
                Selected Work
              </h2>
            </motion.div>

            <motion.p variants={fadeUp} className="text-text-secondary leading-relaxed max-w-2xl xl:max-w-[22rem] mb-14 md:mb-16 xl:mb-0">
              A collection of UX, product design, visual design, and academic projects exploring research,
              interaction design, prototyping, and visual systems.
            </motion.p>
          </div>
        </motion.div>

        {/* The folders render immediately as HTML and CSS. The decorative 3D
            paper layer, when it loads, sits between the folder backs and their
            contents, so the grid is its own stacking context. Column count
            and spacing come from .folder-grid in index.css. */}
        <div ref={gridRef} className="relative isolate xl:col-span-9" data-paper={paper3d ? '3d' : 'css'}>
          <FolderPaperLayer gridRef={gridRef} slots={slots} cards={sceneCards} onActiveChange={setPaper3d} />
          <ul className="folder-grid">
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
    </section>
  )
}
