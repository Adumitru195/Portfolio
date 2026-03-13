export interface CaseStudySection {
  id: string
  title: string
  body?: string
  images?: string[]
  imageLayout?: 'single' | 'grid' | 'grid-2' | 'gallery'
}

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  problem?: string
  goal?: string
  tags: string[]
  year: string
  role: string
  link?: string
  caseStudyLink?: string
  image?: string
  featured: boolean
  sections?: CaseStudySection[]
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
  tags: string[]
}

export interface SocialLink {
  label: string
  url: string
}

export interface PersonInfo {
  name: string
  title: string
  tagline: string
  bio: string[]
  location?: string
  email: string
  phone?: string
  socials: SocialLink[]
}
