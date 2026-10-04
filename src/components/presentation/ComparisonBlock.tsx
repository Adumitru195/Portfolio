import ScreenImage from '@/components/presentation/ScreenImage'
import type { Comparison } from '@/types/presentation'

function Label({ kind }: { kind: 'Before' | 'After' }) {
  const styles =
    kind === 'After'
      ? 'bg-porch-green text-white'
      : 'border border-porch-control bg-white text-porch-charcoal'
  return (
    <span className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${styles}`}>
      {kind}
    </span>
  )
}

function Pair({ comparison, stackOnMobile }: { comparison: Comparison; stackOnMobile: boolean }) {
  return (
    <div className={`grid items-start gap-4 md:gap-6 ${stackOnMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
      <div>
        <Label kind="Before" />
        <ScreenImage image={comparison.before} caption={comparison.beforeCaption} />
      </div>
      <div>
        <Label kind="After" />
        <ScreenImage image={comparison.after} caption={comparison.afterCaption} />
      </div>
    </div>
  )
}

function Copy({ comparison, index }: { comparison: Comparison; index: number }) {
  return (
    <div className="max-w-[65ch]">
      <p className="mb-3 font-porch-display text-lg italic text-porch-green">0{index + 1}</p>
      <h3 className="mb-4 font-porch-display text-2xl font-semibold leading-tight md:text-3xl">{comparison.title}</h3>
      {comparison.body.map((paragraph) => (
        <p key={paragraph} className="mb-4 leading-relaxed text-porch-muted last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

// Before/after pair with explanation, in one of three compositions.
export default function ComparisonBlock({ comparison, index }: { comparison: Comparison; index: number }) {
  if (comparison.layout === 'wide') {
    return (
      <div>
        <div className="mb-10">
          <Copy comparison={comparison} index={index} />
        </div>
        <Pair comparison={comparison} stackOnMobile />
      </div>
    )
  }

  const reverse = comparison.layout === 'split-reverse'
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className={reverse ? 'lg:col-span-5 lg:col-start-8 lg:row-start-1' : 'lg:col-span-4'}>
        <Copy comparison={comparison} index={index} />
      </div>
      <div className={reverse ? 'lg:col-span-6 lg:col-start-1 lg:row-start-1' : 'lg:col-span-8'}>
        <Pair comparison={comparison} stackOnMobile={false} />
      </div>
    </div>
  )
}
