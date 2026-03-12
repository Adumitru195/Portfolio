import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'arcadian-homes',
    title: 'Arcadian Homes',
    subtitle: 'Redesigning the home search experience',
    description:
      'End-to-end UX design for a real estate platform focused on reducing friction in the home discovery process. Conducted user research, built personas and journey maps, ran usability studies, and iterated from low-fidelity wireframes to a tested high-fidelity prototype.',
    tags: ['UX Research', 'Mobile Design', 'Prototyping', 'Usability Testing'],
    year: '2024',
    role: 'UX Designer',
    image: '/Portfolio/projects/arcadian-homes.webp',
    featured: true,
  },
  {
    id: 'reelhouse-cinemas',
    title: 'ReelHouse Cinemas',
    subtitle: 'Streamlining the movie-going experience',
    description:
      'UX design for a cinema ticketing app that simplifies seat selection, food ordering, and checkout into a single, intuitive flow. Focused on reducing drop-off at the payment step and improving the overall booking experience.',
    tags: ['UX Design', 'Mobile App', 'Service Design', 'Interaction Design'],
    year: '2024',
    role: 'UX Designer',
    image: '/Portfolio/projects/reelhouse-cinemas.svg',
    featured: true,
  },
  {
    id: 'sustained-company',
    title: 'The Sustained Company',
    subtitle: 'Connecting conscious consumers with sustainable brands',
    description:
      'UX research and product design for a sustainability-focused platform. Built detailed personas, mapped user journeys, conducted usability studies, and designed low-fidelity concepts that balance discovery with trust-building for eco-conscious shoppers.',
    tags: ['UX Research', 'Product Design', 'Brand Strategy', 'User Testing'],
    year: '2024',
    role: 'UX Designer',
    image: '/Portfolio/projects/sustained-company.webp',
    featured: false,
  },
]
