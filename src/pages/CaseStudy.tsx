import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import { projects } from '@/data/projects'
import Tag from '@/components/Tag'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { CaseStudySection } from '@/types'

function SectionImages({ section }: { section: CaseStudySection }) {
  if (!section.images || section.images.length === 0) return null

  if (section.imageLayout === 'single') {
    return (
      <div className="mt-6 rounded-xl overflow-hidden border border-subtle">
        <img
          src={section.images[0]}
          alt={section.title}
          className="w-full object-contain bg-surface"
        />
      </div>
    )
  }

  if (section.imageLayout === 'gallery') {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {section.images.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-subtle">
            <img
              src={src}
              alt={`${section.title} ${i + 1}`}
              className="w-full object-contain bg-surface"
            />
          </div>
        ))}
      </div>
    )
  }

  if (section.imageLayout === 'grid-2') {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3">
        {section.images.map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-subtle">
            <img
              src={src}
              alt={`${section.title} ${i + 1}`}
              className="w-full block"
            />
          </div>
        ))}
      </div>
    )
  }

  // grid (3-col)
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
      {section.images.map((src, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-subtle">
          <img
            src={src}
            alt={`${section.title} ${i + 1}`}
            className="w-full block"
          />
        </div>
      ))}
    </div>
  )
}

export default function CaseStudy() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">Project not found.</p>
        <Link to="/" className="text-accent hover:underline text-sm">← Back home</Link>
      </div>
    )
  }

  const sectionIds = project.sections?.map((s) => s.id) ?? []

  return (
    <div className="min-h-screen bg-bg">
      {/* Back nav */}
      <nav className="px-6 md:px-10 py-6 border-b border-subtle">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to work
        </Link>
      </nav>

      <main className="px-6 md:px-10 py-16 md:py-24 max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-xs text-text-muted uppercase tracking-widest">{project.year} — {project.role}</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-text-primary mb-3">
              {project.title}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl mb-6">{project.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </motion.div>

          {/* Cover image */}
          {project.image && (
            <motion.div variants={fadeUp} className="mb-16 rounded-2xl overflow-hidden border border-subtle">
              <img
                src={project.image}
                alt={project.title}
                className="w-full object-cover"
                style={{ maxHeight: '480px', objectPosition: 'top' }}
              />
            </motion.div>
          )}

          {/* Overview: problem + goal */}
          {(project.problem || project.goal) && (
            <motion.div
              variants={fadeUp}
              className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {project.problem && (
                <div className="p-6 rounded-2xl border border-subtle bg-surface">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Problem</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.problem}</p>
                </div>
              )}
              {project.goal && (
                <div className="p-6 rounded-2xl border border-subtle bg-surface">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Goal</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.goal}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Jump nav */}
          {sectionIds.length > 0 && (
            <motion.div variants={fadeUp} className="mb-16 p-6 rounded-2xl border border-subtle bg-surface">
              <p className="text-xs text-text-muted uppercase tracking-widest mb-4">Jump to</p>
              <div className="flex flex-wrap gap-2">
                {project.sections!.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Sections */}
          {project.sections?.map((section) => (
            <motion.section
              key={section.id}
              id={section.id}
              variants={fadeUp}
              className="mb-20 scroll-mt-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-subtle" />
                <h2 className="font-display font-bold text-2xl md:text-3xl text-text-primary tracking-tight whitespace-nowrap">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-subtle" />
              </div>

              {section.body && (
                <p className="text-text-secondary leading-relaxed">{section.body}</p>
              )}

              <SectionImages section={section} />
            </motion.section>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
