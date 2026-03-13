export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  year: string
  role: string
  link?: string
  caseStudyLink?: string
  image?: string
  featured: boolean
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
