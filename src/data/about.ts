/**
 * Copy and imagery for the About page (#/about).
 *
 * Keep this page honest: no invented clients, results, research, testimonials
 * or experience. Concept projects are referenced as Andrew's own work only.
 */

const base = import.meta.env.BASE_URL

export interface ImageSource {
  src: string
  width: number
}

export interface Photo {
  id: string
  alt: string
  /** Intrinsic size of the largest source; every source shares its ratio. */
  width: number
  height: number
  sources: ImageSource[]
}

function photo(id: string, alt: string, ratio: [number, number], widths: number[]): Photo {
  const largest = widths[widths.length - 1]
  return {
    id,
    alt,
    width: largest,
    height: Math.round((largest * ratio[1]) / ratio[0]),
    sources: widths.map((width) => ({ src: `${base}about/photo-${id}-${width}.webp`, width })),
  }
}

/**
 * Personal photographs, exported by scripts/about-assets.py from the
 * originals in "About me photos". Beach.jpg is intentionally unused for now.
 *   main     the dominant photo in the opening composition (4:5)
 *   support  the smaller, offset photo beside it (4:5), shown from 640px up
 *   beyond   the "Beyond the screen" section (4:3)
 */
export const aboutPhotos = {
  main: photo('chicago', 'Andrew smiling at night, with city lights blurred behind him', [4, 5], [640, 960, 1280]),
  support: photo('colorado', 'Andrew sitting on a boulder high above a mountain valley under a blue sky', [4, 5], [400, 640, 960]),
  beyond: photo('ocean', 'Andrew in a yellow sweatshirt standing in the surf with both arms raised', [4, 3], [800, 1200, 1600]),
}

export interface ProjectDetail {
  /** Project image to crop into. */
  src: string
  width: number
  height: number
  /** CSS object-position that frames the relevant detail. */
  focus: string
  /**
   * How the detail sits in its 4:3 frame. 'cover' (default) fills the frame.
   * 'phone' is for tall mobile screenshots: a near-square crop, set on a
   * cream panel from tablet up, so the whole detail stays readable.
   */
  presentation?: 'cover' | 'phone'
  alt: string
  caption: string
  projectId: string
}

export interface Strength {
  title: string
  body: string
  detail: ProjectDetail
}

export interface Certification {
  /** Exact title, as written by Andrew. */
  title: string
  year: string
}

export const aboutPage = {
  opening: {
    label: 'Andrew Dumitru · Independent UX/UI designer',
    headline: ['A designer’s eye.', 'A builder’s mindset.'],
    intro:
      'I’m Andrew, a UX/UI designer based in Chicago. I design and build websites and digital products, combining creative thinking with a practical approach to how things work.',
    supporting: [
      'I’m currently studying User Experience Research and Design at DePaul University, where I continue exploring user research, interaction design, and the details that make digital experiences easier to use.',
      'What I enjoy most is taking an idea beyond the first mockup, refining how it looks, how it works, and how everything comes together.',
    ],
    location: 'Based in Chicago',
    workLabel: 'View my work',
    contactLabel: 'Start a project',
  },
  strengths: {
    label: 'How I approach design',
    heading: 'Thoughtful design, from concept to execution.',
    intro:
      'I approach projects by understanding what needs to work, finding a clear visual direction, and considering how the experience comes together beyond the design files.',
    items: [
      {
        title: 'Start with the problem',
        body: 'Before focusing on how something looks, I think about what people need to accomplish. Research, user flows, and clear information help me understand where to begin.',
        detail: {
          src: `${base}projects/porchlight/wf-listing.webp`,
          width: 654,
          height: 491,
          focus: '30% 40%',
          alt: 'Porchlight listing page wireframe with image, price and tour request blocks',
          caption: 'Porchlight · listing wireframe',
          projectId: 'porchlight',
        },
      },
      {
        title: 'Give ideas a visual identity',
        body: 'Typography, color, layout, and interaction all influence how an experience feels. I enjoy developing visual systems that give projects personality without making them harder to use.',
        detail: {
          src: `${base}projects/wovenward/home-hero-800.webp`,
          width: 800,
          height: 500,
          focus: '0% 50%',
          alt: 'Wovenward homepage headline “Clothes you’ll reach for first.” set in a serif with an italic accent',
          caption: 'Wovenward · homepage typography',
          projectId: 'wovenward',
        },
      },
      {
        title: 'Think beyond the mockup',
        body: 'Because I also build interfaces, I consider how designs respond to different screens, how interactions behave, and what happens when someone actually uses them.',
        detail: {
          src: `${base}projects/porchlight/mobile-tour-validation.webp`,
          width: 390,
          height: 844,
          // Frames "Request a tour" through the end of the validation summary.
          focus: '50% 70%',
          presentation: 'phone',
          alt: 'Porchlight mobile tour form showing inline validation messages',
          caption: 'Porchlight · mobile form states',
          projectId: 'porchlight',
        },
      },
    ] satisfies Strength[],
  },
  education: {
    label: 'Education & Certifications',
    heading: 'Always learning. Always building.',
    intro:
      'My education and technical training help me connect design decisions with the practical side of creating digital products.',
    degree: {
      kind: 'Education',
      school: 'DePaul University',
      title: 'Bachelor of Science in User Experience Research and Design',
      dates: '2024–Present',
      status: 'Degree in progress',
    },
    certificationKind: 'Certification',
    certifications: [
      { title: 'Google UX Design Specialization', year: '2024' },
      { title: 'Google Cloud Database Engineer Specialization', year: '2024' },
    ] satisfies Certification[],
  },
  backwater: {
    label: 'The story behind Backwater Journal',
    heading: 'From a personal interest to a working app.',
    body: [
      'Fishing gave me a reason to build something of my own.',
      'I wanted to create a place where anglers could record their catches, explore fishing spots, and connect with others who share the same interest.',
      'That idea became Backwater Journal, an iOS app I designed, developed, and released.',
      'Building it taught me a lot about the decisions that happen after the first design is finished. From refining interactions to working through technical challenges, I learned how much thought goes into making an experience work beyond the screen.',
      'It’s a project that brings together two things I genuinely enjoy: fishing and creating digital products.',
    ],
    linkLabel: 'Explore the Backwater Journal case study',
    projectId: 'backwater-journal',
    // App Store frames converted by scripts/about-assets.py. Order: left, centre, right.
    frames: [
      { id: '01', alt: 'Backwater Journal Dock screen with fishing conditions for the evening' },
      { id: '02', alt: 'Backwater Journal feed post sharing a white crappie catch' },
      { id: '04', alt: 'Backwater Journal Explore map of nearby fishing spots' },
    ].map((frame) => ({
      ...frame,
      width: 720,
      height: 1558,
      sources: [
        { src: `${base}about/backwater-frame-${frame.id}-360.webp`, width: 360 },
        { src: `${base}about/backwater-frame-${frame.id}-720.webp`, width: 720 },
      ],
    })),
  },
  beyond: {
    label: 'Beyond the screen',
    /** The three interests named in the copy below. */
    interests: ['Fishing', 'Exploring new places', 'Technology'],
    heading: 'There’s more to me than pixels and prototypes.',
    body: [
      'Outside of design, I enjoy fishing, exploring new places, and spending time with technology.',
      'I’ve always been curious about how things work, whether it’s something I’m building, an experience I’m designing, or a new interest I’m exploring.',
      'That curiosity is a big part of what keeps me creating.',
    ],
  },
  closing: {
    label: 'Let’s work together',
    heading: 'Have something in mind? Let’s talk.',
    body: [
      'Whether you’re starting a new website, improving an existing experience, or exploring an idea for a digital product, I’d like to hear what you’re working on.',
      'I like keeping projects straightforward, with clear communication, room to explore ideas, and an agreed scope before the work begins.',
    ],
    opportunities: 'I’m also open to UX/UI design opportunities and collaborations.',
    buttonLabel: 'Start a project',
    workLabel: 'View my work',
  },
}

/** The compact About preview on the homepage, linking to #/about. */
export const aboutPreview = {
  label: 'Behind the design',
  heading: ['Curious by nature.', 'Intentional by design.'],
  body: [
    'I’m a Chicago-based UX/UI designer, Air Force veteran, and UX design student at DePaul University.',
    'I enjoy figuring out how things work, why people use them, and how they could be better. My background in research, design, and development helps me approach projects from both a creative and practical perspective.',
  ],
  cta: 'More about me',
  /** Three roles in one line each: what I do, where I'm learning, what I've built. */
  roles: [
    { label: 'Independent', value: 'UX/UI designer' },
    { label: 'Studying', value: 'UX design, DePaul University' },
    { label: 'Built and released', value: 'Backwater Journal for iOS' },
  ],
}
