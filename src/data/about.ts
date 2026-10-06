/**
 * Copy for the About page (#/about).
 *
 * The approach steps describe how Andrew works on new projects. They are not
 * a record of what each portfolio project included, so keep them free of
 * claims about past research, testing, clients or results.
 */

export interface PortraitSource {
  src: string
  width: number
}

export interface Portrait {
  alt: string
  /** Intrinsic size of the largest source, used to reserve layout space. */
  width: number
  height: number
  sources: PortraitSource[]
}

export interface ApproachStep {
  number: string
  title: string
  body: string
}

export interface Principle {
  title: string
  body: string
}

const base = import.meta.env.BASE_URL

// Crop of public/profile.jpg made by scripts/portrait-assets.py.
export const aboutPortrait: Portrait = {
  alt: 'Portrait of Andrew Dumitru outdoors, wearing a charcoal blazer',
  width: 1200,
  height: 1500,
  sources: [
    { src: `${base}portrait/about-800.webp`, width: 800 },
    { src: `${base}portrait/about-1200.webp`, width: 1200 },
  ],
}

export const aboutPage = {
  label: 'About Andrew',
  heading: 'Thoughtful design starts with understanding.',
  intro:
    'I’m Andrew, a UX/UI designer based in Chicago. I design and build websites and apps, bringing together visual design, practical problem solving and attention to the details that shape an experience.',
  background: {
    heading: 'Background',
    body: 'Before moving into design, I spent six years in the U.S. Air Force. That experience shaped how I approach my work: ask questions, pay attention and check the details. I’m now studying UX at DePaul University and putting that approach into practice through my design work.',
  },
  proof: {
    heading: 'From an idea to a working app',
    body: 'Designing and shipping Backwater Journal gave me experience taking a product from an idea to a working app. It taught me to think beyond an individual screen and consider how navigation, content and interactions fit together.',
    linkLabel: 'Explore Backwater Journal',
    projectId: 'backwater-journal',
  },
  approach: {
    heading: 'How I approach UX',
    intro: 'The process I bring to new projects. Each step flexes with the scope, timeline and what the project needs.',
    steps: [
      {
        number: '01',
        title: 'Understand the problem',
        body: 'I start by understanding what the business needs and what people are trying to do. That helps define the problem before deciding what the design should look like.',
      },
      {
        number: '02',
        title: 'Make the structure clear',
        body: 'I map the content and key steps, then explore layouts that make the next action easier to understand. Wireframes help work through those decisions before polishing the visuals.',
      },
      {
        number: '03',
        title: 'Give the design a purpose',
        body: 'I use typography, color, spacing and interaction to guide attention and create a consistent experience. The visual choices should support what someone needs to do.',
      },
      {
        number: '04',
        title: 'Review and refine',
        body: 'I review the design across screen sizes and interaction states, use feedback to improve it and check the details as it comes together. When user testing is part of the project, I use what we learn to guide the next iteration.',
      },
    ] satisfies ApproachStep[],
  },
  workingTogether: {
    heading: 'Working together',
    principles: [
      {
        title: 'Clear scope',
        body: 'Agree on the goal, deliverables and priorities before the work begins.',
      },
      {
        title: 'Room for feedback',
        body: 'Review the direction together while there is still time to make meaningful changes.',
      },
      {
        title: 'Thoughtful delivery',
        body: 'Prepare the agreed design files or implementation so the next step is clear.',
      },
    ] satisfies Principle[],
  },
  closing: {
    heading: 'Have a project in mind?',
    body: 'Tell me what you’re working on and where you need help.',
    buttonLabel: 'Let’s talk',
  },
}
