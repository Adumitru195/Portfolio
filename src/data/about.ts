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
  alt: string
  caption: string
  projectId: string
}

export interface Strength {
  title: string
  body: string
  detail: ProjectDetail
}

export interface WorkingNote {
  title: string
  body: string
}

export const aboutPage = {
  opening: {
    label: 'Andrew Dumitru · Independent UX/UI designer',
    headline: ['A designer’s eye.', 'A builder’s mindset.'],
    intro:
      'I’m Andrew, a UX/UI designer based in Chicago. I design and build websites and apps, with an eye for the details that make them feel clear, useful and worth spending time with.',
    supporting:
      'I enjoy taking an idea beyond the first mockup, working through how it looks, how it behaves and how it comes together in a browser or an app.',
    location: 'Based in Chicago',
    workLabel: 'See my work',
    contactLabel: 'Let’s talk',
  },
  strengths: {
    heading: 'What I bring to a project',
    items: [
      {
        title: 'A clear direction',
        body: 'I work through what the experience needs to do, then organize the content and interactions around it.',
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
        title: 'A considered visual identity',
        body: 'Typography, color and layout should give the work character while keeping it easy to understand.',
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
        title: 'Attention beyond the mockup',
        body: 'I build interfaces too, so I think about responsive layouts, interaction states and how the design behaves when someone actually uses it.',
        detail: {
          src: `${base}projects/porchlight/mobile-tour-validation.webp`,
          width: 390,
          height: 844,
          focus: '50% 80%',
          alt: 'Porchlight mobile tour form showing inline validation messages',
          caption: 'Porchlight · mobile form states',
          projectId: 'porchlight',
        },
      },
    ] satisfies Strength[],
  },
  backwater: {
    label: 'Backwater Journal · iOS app',
    heading: 'From an interest to a working app',
    body: [
      'Fishing gave me a reason to build something of my own.',
      'With Backwater Journal, I took an idea through design and development into a working app. It brought together the parts of the work I enjoy most: shaping an experience, giving it a visual identity and making it function.',
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
  working: {
    heading: 'Working with me',
    notes: [
      {
        title: 'Direct communication',
        body: 'You’ll work directly with me, with space to ask questions and talk through decisions.',
      },
      {
        title: 'Room to explore',
        body: 'We can compare directions and refine the details before settling on what fits.',
      },
      {
        title: 'A clear next step',
        body: 'We’ll agree on the scope and what you need at the end, whether that’s design files, a working website or a focused set of improvements.',
      },
    ] satisfies WorkingNote[],
  },
  beyond: {
    heading: 'Beyond the screen',
    body: 'Outside of design, I enjoy fishing, exploring new places and a good game of Mario Kart. Fishing also inspired Backwater Journal, bringing something I enjoy into something I could design and build.',
  },
  closing: {
    heading: 'Let’s make something worth using.',
    body: 'Have an idea, an existing website or something that needs a fresh direction? Tell me what you’re working on.',
    buttonLabel: 'Let’s talk',
  },
}
