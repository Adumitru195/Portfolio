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
 * "How I can help": a narrow heading column beside three service rows, each
 * pairing a small decorative visual with its heading and description. The
 * text is plain HTML and never waits on the visuals; the static SVGs show
 * first and the Three.js layer takes over on eligible screens.
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
    <section aria-labelledby="services-heading" className="px-6 md:px-10 pt-12 md:pt-16">
      <div className="content-wide">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10% 0px' }}
          onAnimationComplete={(definition) => {
            if (definition === 'visible') setRevealed(true)
          }}
        >
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-12">
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <div className="flex items-center gap-3 lg:sticky lg:top-28">
                <AccentLine />
                <h2 id="services-heading" className="text-xs font-medium text-text-secondary uppercase tracking-widest">
                  {services.label}
                </h2>
              </div>
            </motion.div>

            <div ref={gridRef} className="relative lg:col-span-9">
              <ServiceVisualsLayer gridRef={gridRef} columns={columns} revealed={revealed} onActiveChange={setScene3d} />
              <ul className="m-0 list-none p-0 divide-y divide-[#E6E6E6] border-y border-[#E6E6E6]">
                {services.items.map((service) => (
                  <motion.li
                    key={service.id}
                    ref={(el: HTMLLIElement | null) => registerColumn(service.id, el)}
                    variants={fadeUp}
                    className="grid min-w-0 grid-cols-1 gap-y-6 py-9 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:items-center sm:gap-x-10 md:py-10 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[minmax(0,12rem)_minmax(0,15rem)_minmax(0,1fr)] xl:gap-x-16 2xl:gap-x-24"
                  >
                    <div
                      data-visual-slot
                      aria-hidden="true"
                      className="relative aspect-[8/5] w-full max-w-[12rem] [container-type:inline-size] sm:max-w-none"
                    >
                      <ServiceVisualStatic id={service.id} hidden={scene3d} />
                    </div>
                    <div className="min-w-0 xl:contents">
                      <h3 className="font-display font-bold text-xl md:text-2xl tracking-tight text-text-primary mb-3 xl:mb-0">
                        {service.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed max-w-[44ch] md:text-[1.0625rem]">{service.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
