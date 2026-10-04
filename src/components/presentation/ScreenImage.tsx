import { motion } from 'framer-motion'
import { imageReveal } from '@/lib/motion'
import { usePresentationTheme } from '@/lib/presentationTheme'
import type { PresentationImage } from '@/types/presentation'

interface ScreenImageProps {
  image: PresentationImage
  caption?: string
  chrome?: boolean
  className?: string
}

// A screenshot in a thin browser frame, with its intrinsic size reserved.
export default function ScreenImage({ image, caption, chrome = false, className = '' }: ScreenImageProps) {
  const theme = usePresentationTheme()
  return (
    <motion.figure
      variants={imageReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      className={`m-0 ${className}`}
    >
      <div className={`overflow-hidden rounded-xl border ${theme.screenFrame}`}>
        {chrome && (
          <div aria-hidden="true" className={`flex h-7 items-center gap-1.5 border-b px-3 ${theme.chromeBar}`}>
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
            <span className={`h-2 w-2 rounded-full ${theme.chromeDot}`} />
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
      {caption && (
        <figcaption className="mt-3 text-sm leading-snug text-[color:var(--pres-muted)]">{caption}</figcaption>
      )}
    </motion.figure>
  )
}
