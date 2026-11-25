import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'backwater-journal',
    title: 'Backwater Journal',
    subtitle: 'A released iOS fishing journal, map, marketplace and angler community',
    description:
      'An independent iOS app I designed, built and released in July 2026. It connects structured catch logs and journal entries, map-first discovery, a community Dock and a gear Market. The case study follows the product through version 1.2.0, including the 1.1.0 update that rebuilt Explore.',
    role: 'Founder, Product Designer & Mobile App Developer',
    tags: ['Product Design', 'Mobile App', 'UX Strategy', 'iOS'],
    year: '2026',
    image: '/Portfolio/projects/backwater-journal/backwater-cover.jpg',
    imageAlt: 'Backwater Journal case study cover: “Every catch has a story.” beside the current Dock and Explore screens.',
    link: 'https://www.backwaterjournal.com/',
    featured: true,
  },
  {
    id: 'aic-museum-experience',
    title: 'AIC Museum Experience',
    subtitle: 'Academic Group Project · UXD 260: Research & Evaluation · DePaul University',
    description:
      'An academic group concept exploring how a visit to the Art Institute of Chicago could feel more flexible, more social and worth returning for. Our team interviewed 12 young adults and mapped the visitor journey; I conducted interviews, reviewed responses, contributed to the journey map, designed Figma screens and created presentation slides.',
    role: 'UX Researcher / Product Designer',
    tags: ['UX Research', 'Mobile App', 'Group Project', 'Academic'],
    year: '2026',
    image: '/Portfolio/projects/aic-museum-experience/aic-cover.jpg',
    imageAlt: 'AIC Museum Experience title beside Georges Seurat’s A Sunday on La Grande Jatte, a public-domain painting from the Art Institute of Chicago, hung in a pale arch.',
    featured: false,
  },
  {
    id: 'porchlight',
    title: 'Porchlight',
    subtitle: 'Find a home, understand the details, and know what happens next',
    description:
      'A responsive rental discovery experience for Charlotte, NC, redesigned from my earlier real estate concept, Arcadian Homes. It narrows the product to rentals and focuses on practical search, clear monthly costs, and a tour request flow that is honest about its status. I led the product direction, UX/UI and interaction design, and reviewed and refined a working responsive prototype against those goals.',
    role: 'UX & UI Designer',
    tags: ['UX Design', 'Responsive Web', 'Interaction Design', 'Accessibility'],
    year: '2026',
    image: '/Portfolio/projects/porchlight/cover.webp',
    featured: true,
  },
  {
    id: 'afterglow-cinema',
    title: 'Afterglow Cinema',
    subtitle: 'Film discovery, with a clearer next step',
    description:
      'A responsive cinema experience that brings film discovery, showtimes and a clear showing summary into one connected flow.',
    role: 'UX & UI Designer',
    tags: ['UX Design', 'Responsive Web', 'Interaction Design', 'Accessibility'],
    year: '2026',
    image: '/Portfolio/projects/afterglow-cinema/afterglow-card-midnight-lavender.webp',
    cardBackground: '#141827',
    featured: true,
  },
  {
    id: 'wovenward',
    title: 'Wovenward',
    subtitle: 'E-commerce UX/UI',
    description:
      'A responsive clothing shopping experience focused on available sizes, fit guidance and a clear path from browsing to bag.',
    role: 'UX & UI Designer',
    tags: ['E-commerce', 'Responsive Web', 'Interaction Design', 'Accessibility'],
    year: '2026',
    image: '/Portfolio/projects/wovenward/card-wovenward-home.webp',
    imageAlt:
      'Wovenward homepage: the serif headline "Clothes you’ll reach for first." beside a photo of a blush wool coat and an inset of an oat jumper, on a porcelain background',
    cardBackground: '#F5F2EC',
    featured: true,
  },
  {
    id: 'typography-systems',
    title: 'Typography Systems',
    subtitle: 'Editorial Design & Typography',
    description:
      'Two editorial studies exploring how typography, hierarchy and composition shape the way information is read.',
    role: 'Editorial Designer',
    tags: ['Typography', 'Editorial Design', 'Print', 'Visual Hierarchy'],
    year: '2026',
    image: '/Portfolio/projects/typography-systems/card-typography-systems.webp',
    imageAlt:
      'The ONE-X cover, a tall black and burgundy serif title on warm paper, beside a member spread with portraits and the names Adam Gontier and Barry Stock',
    cardBackground: '#211616',
    featured: false,
  },
]
