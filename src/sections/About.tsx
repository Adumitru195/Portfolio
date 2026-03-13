import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, slideInLeft } from '@/lib/motion'
import { person } from '@/data/person'
import { experience } from '@/data/experience'
import Tag from '@/components/Tag'

const competencies = [
  {
    label: 'Design & Research',
    items: ['User Experience Research and Design', 'UX Design', 'User Research', 'UX Research', 'Wireframing', 'Prototyping', 'User Interface Design', 'UI Design', 'Visual Hierarchy'],
  },
  {
    label: 'Tools',
    items: ['Figma', 'Adobe Creative Suite', 'Miro', 'Microsoft Office Suite'],
  },
  {
    label: 'Languages',
    items: ['English (Native)', 'Romanian (Fluent)'],
  },
]

export default function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-32 border-t border-subtle">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 lg:gap-24"
        >
          {/* Left — bio */}
          <div>
            <motion.div variants={fadeUp} className="mb-8">
              <img
                src="/Portfolio/profile.jpg"
                alt={person.name}
                className="w-48 h-48 rounded-2xl object-cover object-top border border-subtle"
              />
            </motion.div>

            <motion.div variants={slideInLeft} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-accent" />
                <span className="text-xs text-text-muted uppercase tracking-widest">About</span>
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-tightest text-text-primary leading-tight">
                Hi, I'm {person.name.split(' ')[0]}.
              </h2>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4 mb-10">
              {person.bio.map((paragraph, i) => (
                <p key={i} className="text-text-secondary leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-5">
              {competencies.map((group) => (
                <div key={group.label}>
                  <p className="text-xs text-text-muted uppercase tracking-widest mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Tag key={item} label={item} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — experience */}
          <div>
            <motion.div variants={fadeUp} className="mb-8">
              <p className="text-xs text-text-muted uppercase tracking-widest mb-6">Experience</p>

              <div className="space-y-0">
                {experience.map((job, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="py-6 border-b border-subtle last:border-b-0 group"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-lg text-text-primary tracking-tight group-hover:text-accent transition-colors duration-200">
                          {job.role}
                        </h3>
                        <p className="text-text-secondary text-sm">{job.company}</p>
                      </div>
                      <span className="shrink-0 text-xs text-text-muted font-mono mt-1">{job.period}</span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <Tag key={tag} label={tag} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
