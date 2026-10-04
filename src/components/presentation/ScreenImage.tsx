import { motion } from 'framer-motion'
import { imageReveal } from '@/lib/motion'
import type { PresentationImage } from '@/types/presentation'

interface ScreenImageProps {
  image: PresentationImage
  caption?: string
  chrome?: boolean
  className?: string
  captionClassName?: string
}

// A screenshot in a thin browser frame, with its intrinsic size reserved.
export default function ScreenImage({
  image,
  caption,
  chrome = false,
  className = '',
  captionClassName = 'text-porch-muted',
}: ScreenImageProps) {
  return (
    <motion.figure
      variants={imageReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`m-0 ${className}`}
    >
      <div className="overflow-hidden rounded-xl border border-porch-border bg-white shadow-[0_28px_60px_-34px_rgba(30,52,41,0.45)]">
        {chrome && (
          <div aria-hidden="true" className="flex h-7 items-center gap-1.5 border-b border-porch-border bg-porch-sunken px-3">
            <span className="h-2 w-2 rounded-full bg-[#D9CFC0]" />
            <span className="h-2 w-2 rounded-full bg-[#D9CFC0]" />
            <span className="h-2 w-2 rounded-full bg-[#D9CFC0]" />
          </div>
        )}
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      {caption && <figcaption className={`mt-3 text-sm leading-snug ${captionClassName}`}>{caption}</figcaption>}
    </motion.figure>
  )
}
