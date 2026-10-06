import { motion } from 'framer-motion'
import type { ImageSource } from '@/data/about'

interface Frame {
  id: string
  alt: string
  width: number
  height: number
  sources: ImageSource[]
}

// Side frames fan out from behind the centre one, once, as the group enters.
const ease = [0.22, 1, 0.36, 1] as const
const fan = {
  left: {
    hidden: { opacity: 0, x: '40%', rotate: 0 },
    visible: { opacity: 1, x: 0, rotate: -7, transition: { duration: 0.9, ease, delay: 0.15 } },
  },
  centre: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
  },
  right: {
    hidden: { opacity: 0, x: '-40%', rotate: 0 },
    visible: { opacity: 1, x: 0, rotate: 7, transition: { duration: 0.9, ease, delay: 0.15 } },
  },
}

function FrameImage({ frame, sizes }: { frame: Frame; sizes: string }) {
  const largest = frame.sources[frame.sources.length - 1]
  return (
    <img
      src={largest.src}
      srcSet={frame.sources.map((s) => `${s.src} ${s.width}w`).join(', ')}
      sizes={sizes}
      width={frame.width}
      height={frame.height}
      alt={frame.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="block w-full h-auto rounded-[22px] md:rounded-[28px] border border-backwater-edge shadow-[0_36px_60px_-30px_rgba(31,59,44,0.45)]"
    />
  )
}

/** Three Backwater Journal App Store frames, fanned like cards in a hand. */
export default function BackwaterFrames({ frames }: { frames: Frame[] }) {
  const [left, centre, right] = frames
  if (!left || !centre || !right) return null

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15% 0px' }}
      className="relative mx-auto w-full max-w-[34rem] pt-[4%] pb-[8%]"
    >
      <motion.div variants={fan.left} className="absolute left-[4%] sm:left-0 top-[12%] w-[33%] sm:w-[36%] origin-bottom-right">
        <FrameImage frame={left} sizes="(min-width: 1024px) 190px, 34vw" />
      </motion.div>
      <motion.div variants={fan.right} className="absolute right-[4%] sm:right-0 top-[12%] w-[33%] sm:w-[36%] origin-bottom-left">
        <FrameImage frame={right} sizes="(min-width: 1024px) 190px, 34vw" />
      </motion.div>
      <motion.div variants={fan.centre} className="relative z-10 mx-auto w-[44%]">
        <FrameImage frame={centre} sizes="(min-width: 1024px) 240px, 42vw" />
      </motion.div>
    </motion.div>
  )
}
