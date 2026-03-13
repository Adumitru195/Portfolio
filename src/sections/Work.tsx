import { motion } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { staggerContainer, fadeUp, scaleUp } from '@/lib/motion'
import { projects } from '@/data/projects'
import Tag from '@/components/Tag'
import type { Project } from '@/types'

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0

  return (
    <motion.article
      variants={scaleUp}
      className="group relative rounded-2xl overflow-hidden border border-subtle bg-surface hover:border-text-muted transition-colors duration-500"
    >
      <Link to={`/project/${project.id}`} className="block">
        {/* Thumbnail */}
        <div
          className="w-full aspect-[16/9] relative overflow-hidden"
          style={{
            background: isEven
              ? 'linear-gradient(135deg, #1a1a1a 0%, #242424 100%)'
              : 'linear-gradient(135deg, #141414 0%, #1e1e1e 100%)',
          }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-black text-6xl md:text-8xl text-surface-overlay select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          )}
          {/* Hover overlay with "View Case Study" label */}
          <div className="absolute inset-0 bg-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 text-text-primary text-sm font-medium px-4 py-2 rounded-full border border-text-muted bg-bg/80">
              View Case Study <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-text-muted mb-1">{project.year} — {project.role}</p>
              <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary tracking-tight">
                {project.title}
              </h3>
              <p className="text-text-secondary text-sm mt-0.5">{project.subtitle}</p>
            </div>
            <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-subtle text-text-secondary group-hover:text-text-primary group-hover:border-text-secondary transition-colors duration-200">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function Work() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

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
          <motion.div variants={fadeUp} className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-xs text-text-muted uppercase tracking-widest">Selected Work</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-6xl tracking-tightest text-text-primary">
              Things I've built.
            </h2>
          </motion.div>

          {/* Featured projects — 2-col grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6"
          >
            {featured.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>

          {/* Non-featured — 3-col grid */}
          {rest.length > 0 && (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              {rest.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={featured.length + i} />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
