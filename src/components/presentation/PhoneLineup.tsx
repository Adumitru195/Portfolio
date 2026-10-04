import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { PhoneScreen } from '@/types/presentation'

// A row of phone-framed screenshots with one caption each.
export default function PhoneLineup({ screens }: { screens: PhoneScreen[] }) {
  const theme = usePresentationTheme()
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className="grid list-none grid-cols-2 gap-x-4 gap-y-10 p-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5"
    >
      {screens.map((screen) => (
        <motion.li key={screen.image.src} variants={fadeUp}>
          <figure className="m-0">
            <div className={`rounded-[2rem] p-[5px] sm:p-1.5 ${theme.phoneFrame}`}>
              <img
                src={screen.image.src}
                alt={screen.image.alt}
                width={screen.image.width}
                height={screen.image.height}
                loading="lazy"
                decoding="async"
                className="block aspect-[390/844] h-auto w-full rounded-[1.65rem] object-cover object-top"
              />
            </div>
            <figcaption className="mt-4 text-sm leading-snug text-[color:var(--pres-muted)]">{screen.caption}</figcaption>
          </figure>
        </motion.li>
      ))}
    </motion.ul>
  )
}
