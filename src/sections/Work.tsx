import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { projects } from '@/data/projects'
import { workFolders } from '@/data/work-folders'
import AccentLine from '@/components/AccentLine'
import ProjectFolderCard from '@/components/work/ProjectFolderCard'
import FolderPaperLayer from '@/components/work/FolderPaperLayer'
import { useMediaQuery } from '@/hooks/useMediaQuery'

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
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  const registerSlot = useCallback((id: string, element: HTMLElement | null) => {
    if (element) slots.current.set(id, element)
    else slots.current.delete(id)
  }, [])

  return (
    <section id="work" className="px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
        >
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

          <motion.p variants={fadeUp} className="text-text-secondary leading-relaxed max-w-2xl mb-12 md:mb-14">
            A collection of UX, product design, visual design, and academic projects exploring research,
            interaction design, prototyping, and visual systems.
          </motion.p>
        </motion.div>

        {/* The folders render immediately as HTML and CSS. The decorative 3D
            paper layer, when it loads, sits between the folder backs and their
            contents, so the grid is its own stacking context. */}
        <div ref={gridRef} className="relative isolate" data-paper={paper3d ? '3d' : 'css'}>
          <FolderPaperLayer gridRef={gridRef} slots={slots} cards={sceneCards} onActiveChange={setPaper3d} />
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-12 p-0 sm:gap-y-14 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20">
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
