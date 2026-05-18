import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react'
import { projects } from '@/data/projects'
import Tag from '@/components/Tag'
import { fadeUp, staggerContainer } from '@/lib/motion'
import type { CaseStudySection } from '@/types'

function FullGalleryImages({ section }: { section: CaseStudySection }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const images = section.images ?? []
  const captions = section.captions ?? []
  const preview = section.previewImages ?? images.slice(0, 4)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(images.length - 1, i + 1))

  const openAt = (i: number) => { setIndex(i); setOpen(true) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, index])

  if (images.length === 0) return null

  return (
    <div className="mt-6">
      {/* Curated preview grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {preview.map((src, i) => {
          const fullIdx = images.indexOf(src)
          const caption = captions[fullIdx] ?? captions[i] ?? ''
          return (
            <button
              key={i}
              onClick={() => openAt(fullIdx >= 0 ? fullIdx : i)}
              className="group block rounded-xl overflow-hidden border border-subtle hover:border-text-muted transition-colors duration-200 text-left"
              aria-label={`Open ${caption || `layout ${i + 1}`} in gallery`}
            >
              <img
                src={src}
                alt={caption || `Typography layout study ${i + 1}`}
                className="w-full block group-hover:scale-[1.02] transition-transform duration-500"
              />
              {caption && (
                <p className="px-3 py-2 text-xs text-text-muted">{caption}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* View all button */}
      <button
        onClick={() => openAt(0)}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-subtle hover:border-text-muted px-5 py-2.5 rounded-full transition-colors duration-200"
      >
        View All Layouts
        <span className="text-text-muted font-normal">({images.length})</span>
      </button>

      {/* Lightbox modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full layout gallery"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs font-mono">{index + 1} / {images.length}</span>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
                aria-label="Close gallery"
              >
                <X size={16} weight="bold" /> Close
              </button>
            </div>

            {/* Image */}
            <div className="rounded-xl overflow-hidden bg-white">
              <img
                src={images[index]}
                alt={captions[index] || `Typography layout study, page ${index + 1}`}
                className="w-full max-h-[68vh] object-contain block"
              />
            </div>

            {/* Caption */}
            {captions[index] && (
              <p className="text-white/60 text-sm mt-3 text-center">{captions[index]}</p>
            )}

            {/* Prev / thumbnail strip / Next */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={prev}
                disabled={index === 0}
                className="flex items-center gap-1.5 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm shrink-0"
                aria-label="Previous layout"
              >
                <ArrowLeft size={15} /> Prev
              </button>

              {/* Thumbnail strip */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-1.5 justify-center min-w-0">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`shrink-0 w-10 h-7 rounded overflow-hidden border-2 transition-all duration-150 ${
                        i === index
                          ? 'border-white opacity-100'
                          : 'border-transparent opacity-40 hover:opacity-70'
                      }`}
                      aria-label={captions[i] ?? `Page ${i + 1}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={next}
                disabled={index === images.length - 1}
                className="flex items-center gap-1.5 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm shrink-0"
                aria-label="Next layout"
              >
                Next <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
      <div className="mt-6 grid grid-cols-2 gap-4">
        {section.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${section.title} ${i + 1}`}
            className="w-full block rounded-xl"
          />
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

  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    if (sectionIds.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sectionIds.join(',')])

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
              <span className="text-xs text-text-muted uppercase tracking-widest">{project.year} · {project.role}</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-text-primary mb-3">
              {project.title}
            </h1>
            <p className="text-text-secondary text-lg md:text-xl mb-6">{project.subtitle}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            {project.details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-subtle">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Role</p>
                  <p className="text-sm text-text-primary font-medium">{project.role}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Timeline</p>
                  <p className="text-sm text-text-primary font-medium">{project.details.timeline}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Tools</p>
                  <p className="text-sm text-text-primary font-medium">{project.details.tools}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Platform</p>
                  <p className="text-sm text-text-primary font-medium">{project.details.platform}</p>
                </div>
              </div>
            )}
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

          {/* Overview: problem + goal + solution */}
          {(project.problem || project.goal || project.solution) && (
            <motion.div
              variants={fadeUp}
              className={`mb-16 grid grid-cols-1 gap-6 ${project.solution ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
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
              {project.solution && (
                <div className="p-6 rounded-2xl border border-subtle bg-surface">
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Solution</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{project.solution}</p>
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
                  <button
                    key={s.id}
                    onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      activeSection === s.id
                        ? 'border-text-primary bg-text-primary text-surface font-semibold'
                        : 'border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted'
                    }`}
                  >
                    {s.title}
                  </button>
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
              className="mb-20 scroll-mt-24"
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

              {section.imageLayout === 'full-gallery'
                ? <FullGalleryImages section={section} />
                : <SectionImages section={section} />
              }
            </motion.section>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
