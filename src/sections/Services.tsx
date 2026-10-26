import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/motion'
import { services } from '@/data/services'
import type { ServiceId } from '@/data/services'
import AccentLine from '@/components/AccentLine'
import ServiceVisualStatic from '@/components/services/ServiceVisualStatic'
import ServiceVisualsLayer from '@/components/services/ServiceVisualsLayer'
import type { ServiceColumn } from '@/components/services/ServiceVisualsScene'

/**
 * "How I can help": three services in open columns, each with a small
 * decorative visual above its heading. The text is plain HTML and never
 * waits on the visuals; the static SVGs show first and the Three.js layer
 * takes over on eligible screens.
 */
export default function Services() {
  const gridRef = useRef<HTMLDivElement>(null)
  const columns = useRef<ServiceColumn[]>([])
  const [scene3d, setScene3d] = useState(false)
  // The 3D layer waits for the columns' reveal, so it never shows ahead of them.
  const [revealed, setRevealed] = useState(false)

  // Kept in list order, which is the order the scene draws them in.
  const registerColumn = useCallback((id: ServiceId, column: HTMLElement | null) => {
    const others = columns.current.filter((c) => c.id !== id)
    const slot = column?.querySelector<HTMLElement>('[data-visual-slot]')
    const next = column && slot ? [...others, { id, column, slot }] : others
    const order = services.items.map((s) => s.id)
    columns.current = next.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }, [])

  return (
    <section aria-labelledby="services-heading" className="px-6 md:px-10 pt-16 md:pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          onAnimationComplete={(definition) => {
            if (definition === 'visible') setRevealed(true)
          }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10 md:mb-14">
            <AccentLine />
            <h2 id="services-heading" className="text-xs font-medium text-text-secondary uppercase tracking-widest">
              {services.label}
            </h2>
          </motion.div>

          <div ref={gridRef} className="relative">
            <ServiceVisualsLayer gridRef={gridRef} columns={columns} revealed={revealed} onActiveChange={setScene3d} />
            <ul
              className="m-0 grid list-none grid-cols-1 p-0 divide-y divide-[#E6E6E6] md:grid-cols-3 md:divide-y-0 md:divide-x"
            >
              {services.items.map((service) => (
                <motion.li
                  key={service.id}
                  ref={(el: HTMLLIElement | null) => registerColumn(service.id, el)}
                  variants={fadeUp}
                  className="min-w-0 py-9 first:pt-0 last:pb-0 md:py-0 md:px-8 md:first:pl-0 md:last:pr-0 lg:px-10"
                >
                  <div
                    data-visual-slot
                    aria-hidden="true"
                    className="relative mb-7 aspect-[8/5] w-full max-w-[12rem] [container-type:inline-size] md:max-w-[15rem]"
                  >
                    <ServiceVisualStatic id={service.id} hidden={scene3d} />
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed max-w-[34ch]">{service.body}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
