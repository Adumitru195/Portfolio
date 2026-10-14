import type { PresentationImage } from '@/types/presentation'

const base = '/Portfolio/projects/aic-museum-experience'

// Original screen exports. Each one was checked against the case study PDF
// before it was labeled; the same flows exist in light and dark versions.
const screen = (file: string, width: number, height: number, alt: string): PresentationImage => ({
  src: `${base}/${file}`,
  width,
  height,
  alt,
})

export const aicScreens = {
  welcome: screen('app-01.jpg', 786, 1704,
    'Onboarding welcome screen: a classical sculpture behind a welcome message, the Art Institute of Chicago logo and a Next button.'),
  access: screen('app-03.jpg', 786, 1704,
    'Access screen asking visitors to log in or sign up to use the market, with Login, Sign Up and Continue as Guest buttons.'),
  explainNft: screen('app-04.jpg', 786, 1704,
    'Onboarding screen titled “What is an NFT?” with a short definition and a Let’s Go button.'),
  homeLight: screen('app-06.jpg', 786, 1934,
    'Light home screen: search, a Market, Map, Events and Rewards category row, an Upcoming Events list with dates, and Curated Collections.'),
  homeDark: screen('app-18.jpg', 786, 1934,
    'Dark version of the same home screen, with Upcoming Events and Curated Collections over a darkened sculpture image.'),
  market: screen('app-10.jpg', 786, 1934,
    'Market screen listing trending NFT collections with floor prices, followed by a list of trending artists.'),
  collection: screen('app-07.jpg', 786, 1934,
    'My Collection screen: a wallet address and collected items grouped by event date.'),
  collectible: screen('app-09.jpg', 706, 1436,
    'Collectible detail screen: artwork marked 52 of 100, blockchain and reward notes, “You and 70 others were there” and a Share button.'),
  pass: screen('app-12.jpg', 786, 1704,
    'NFT pass screen: a large red QR-style code above the words NFT Pass, over a sculpture of lions.'),
}

export interface AicPoint {
  title: string
  body: string
}

export interface AicScreenCard {
  label: string
  body: string
  image: PresentationImage
}

export interface JourneyStage {
  stage: string
  state: 'Neutral' | 'Frustrated'
  body: string
}

export interface DirectionRow {
  theme: string
  response: string
  test: string
}

export const aic = {
  documentTitle: 'AIC Museum Experience · Andrew Dumitru',
  runningHead: 'Academic concept / DePaul University / Spring 2026',

  opening: {
    eyebrow: 'UX research + mobile product concept',
    titleLines: ['Beyond', 'the gallery.'],
    project: 'AIC Museum Experience',
    lede: 'Exploring how a museum visit could feel more flexible, more social and worth returning for.',
    roleLabel: 'My role',
    role: 'Interviews, reviewing responses, journey mapping, Figma screens and presentation slides.',
    screens: [
      { label: 'Light exploration', body: 'Home screen', image: aicScreens.homeLight },
      { label: 'Dark exploration', body: 'Home screen', image: aicScreens.homeDark },
    ] satisfies AicScreenCard[],
    caption: 'Original light and dark explorations of the same home screen.',
  },

  context: {
    label: 'Context + contribution',
    kicker: 'The brief',
    title: 'Make the visit feel worth the effort.',
    body: 'Our team explored a mobile companion concept for young museum visitors. I helped turn interview responses into a visitor journey and contributed to the screens and presentation.',
    contributionLabel: 'My contribution',
    contribution: [
      { title: 'Listen', body: 'I conducted interviews and reviewed the responses.' },
      { title: 'Synthesize', body: 'I contributed to the visitor journey map.' },
      { title: 'Design + communicate', body: 'I designed screens in Figma and created presentation slides.' },
    ] satisfies AicPoint[],
    record: [
      { label: 'Project', value: 'Academic group concept' },
      { label: 'Team', value: 'Damir, Chris, Ryan, Andrew, Omar' },
      { label: 'Course', value: 'UXD 260: Research & Evaluation, DePaul University' },
      { label: 'Tools', value: 'Figma, Pitch' },
      { label: 'Scope', value: 'Research to mobile concept' },
    ],
    disclaimer:
      'Independent coursework exploring the Art Institute of Chicago experience; not commissioned client work or an official museum product.',
  },

  research: {
    label: 'Research',
    kicker: 'Listen before proposing',
    title: 'Twelve conversations about cultural outings.',
    stats: [
      { value: '12', label: 'semi-structured interviews' },
      { value: '18–25', label: 'participant age range' },
      { value: '20–30', label: 'minutes per interview' },
    ],
    body: 'Our team spoke with college students and young professionals through remote and in-person sessions. The sample included frequent visitors, occasional visitors and people who tended to avoid museums.',
    exploredLabel: 'What we explored',
    explored: [
      'Leisure habits and social planning',
      'Museum perceptions and attendance barriers',
      'Technology use during outings',
    ],
    quote: 'Museums feel like you’re signing up for a whole thing.',
    quoteSource: 'Interview participant, age 20 · team research deck',
  },

  findings: {
    label: 'Research findings',
    kicker: 'Patterns in the interviews',
    title: 'The friction was bigger than the interface.',
    items: [
      { title: 'Time commitment', body: 'Participants preferred flexible, low-pressure outings over a visit that felt like a major commitment.' },
      { title: 'Social coordination', body: 'Finding a time and organizing a group made spontaneous visits harder.' },
      { title: 'Cost sensitivity', body: 'Free days and discounts made attendance more appealing.' },
      { title: 'Passive engagement', body: 'Text-heavy exhibits could reduce energy and interest.' },
      { title: 'Useful technology', body: 'A phone was welcome when it added value rather than more work.' },
      { title: 'Social discovery', body: 'TikTok, Instagram and friends helped people discover experiences.' },
    ] satisfies AicPoint[],
    note: 'Qualitative themes from our team study; not population-wide or statistically representative findings.',
  },

  journey: {
    label: 'Journey mapping',
    kicker: 'Visitor emotional journey',
    title: 'The visit starts before the front door.',
    body: 'I contributed to our team’s journey map. Planning and arrival were the clearest low points in our synthesis.',
    scaleNote: 'Qualitative synthesis, not measured emotion scores',
    stages: [
      { stage: 'Discovery', state: 'Neutral', body: 'Finds an exhibit through social media; looks for a break from routine.' },
      { stage: 'Planning', state: 'Frustrated', body: 'Checks prices, coordinates schedules and questions whether it is worth it.' },
      { stage: 'Arrival', state: 'Frustrated', body: 'Finds parking, navigates an unfamiliar place and scans a ticket.' },
      { stage: 'Engagement', state: 'Neutral', body: 'Walks, takes photos and videos, and encounters limited interactivity.' },
      { stage: 'Exit + reflection', state: 'Neutral', body: 'Leaves unsure whether the experience justified the time and money.' },
    ] satisfies JourneyStage[],
    opportunity:
      'Design opportunity: reduce uncertainty before arrival, then offer optional ways to engage and remember the visit.',
  },

  direction: {
    label: 'Research into direction',
    kicker: 'Interpretation, not validation',
    title: 'Give each idea a reason to exist.',
    columns: { theme: 'Research theme', response: 'Concept response', test: 'What remains to test' },
    rows: [
      {
        theme: 'Planning feels like work',
        response: 'Bring events and dates into a browsable home screen.',
        test: 'Can someone find a suitable event and understand its details?',
      },
      {
        theme: 'Experiences feel passive',
        response: 'Explore an optional digital collecting layer alongside exhibits.',
        test: 'Does collecting add meaning, or distract from the art?',
      },
      {
        theme: 'Social activity matters',
        response: 'Include a share action on the collectible detail screen.',
        test: 'Would visitors use it to share a visit with friends?',
      },
      {
        theme: 'Technology needs clear value',
        response: 'Explain unfamiliar features and offer guest access.',
        test: 'Can visitors explore without feeling forced into an account?',
      },
    ] satisfies DirectionRow[],
    note: 'These connections explain our design intent. They do not establish that the concept solved the research problems.',
  },

  onboarding: {
    label: 'Onboarding',
    kicker: 'Introduce the experience',
    title: 'Explain the unfamiliar. Keep entry open.',
    screens: [
      { label: 'Welcome', body: 'Museum imagery establishes the setting before the feature explanation.', image: aicScreens.welcome },
      { label: 'Choose access', body: 'Login, sign-up and guest access give visitors different ways to enter.', image: aicScreens.access },
      { label: 'Explain collecting', body: 'A dedicated screen introduces the NFT concept before the market.', image: aicScreens.explainNft },
    ] satisfies AicScreenCard[],
    nextLabel: 'My next pass',
    next: 'I would shorten the introduction and make the useful parts of the visit visible earlier. A first-time visitor should understand the value before learning the technology.',
  },

  discovery: {
    label: 'Discovery',
    kicker: 'Events + collections',
    title: 'Make browsing feel familiar.',
    screens: [
      { label: 'Home', body: 'Upcoming events with dates, then curated collections.', image: aicScreens.homeLight },
      { label: 'Market', body: 'Trending NFT collections and artists, in the same row pattern.', image: aicScreens.market },
    ] satisfies AicScreenCard[],
    points: [
      { title: 'Events lead the home', body: 'Upcoming events pair titles with dates, while curated collections provide a second browsing path.' },
      { title: 'Repeated rows create rhythm', body: 'Thumbnails, names and trailing arrows repeat, helping the interface feel predictable.' },
      { title: 'The market is a separate layer', body: 'Trending collections and artists introduce digital collecting. Its value still needs to be tested with visitors.' },
    ] satisfies AicPoint[],
  },

  collecting: {
    label: 'Collecting concept',
    kicker: 'Beyond the building',
    title: 'A record of the visit, with open questions.',
    badge: 'Speculative concept',
    screens: [
      { label: 'My collection', body: 'Collected items grouped by the date of the visit or event.', image: aicScreens.collection },
      { label: 'Collectible detail + share', body: 'An edition number, notes on rewards and a share action.', image: aicScreens.collectible },
      { label: 'NFT pass', body: 'A pass presented as a large QR-style code.', image: aicScreens.pass },
    ] satisfies AicScreenCard[],
    body: 'Our team explored collecting, rewards and an NFT pass as one possible extension of the visit. These are speculative product ideas, not demonstrated visitor needs.',
    next: 'I would test a simpler saved-visit or digital keepsake experience before assuming a wallet or paid collectible is necessary.',
  },

  visual: {
    label: 'Visual direction',
    kicker: 'A gallery-inspired presentation',
    title: 'Art provides the character. Structure does the work.',
    screens: [
      { label: 'Original light exploration', body: '', image: aicScreens.homeLight },
      { label: 'Original dark exploration', body: '', image: aicScreens.homeDark },
    ] satisfies AicScreenCard[],
    subtitle: 'One identity, two explorations',
    body: 'The original screens pair a red accent with sculptural imagery and serif headings. Light and dark versions explore the same visual language.',
    swatches: [
      { name: 'Warm paper', hex: '#F6F2EB' },
      { name: 'Burgundy', hex: '#842C3B' },
      { name: 'Gallery ink', hex: '#27231F' },
    ],
    framing: 'For this case study, warm paper, fine rules and generous spacing frame the original work. Burgundy marks important ideas without competing with the screenshots.',
  },

  nextIteration: {
    label: 'Next iteration',
    kicker: 'A more focused next step',
    title: 'Polish the decisions, then test the experience.',
    items: [
      { title: 'Reduce competing navigation', body: 'The screens show a top category row and bottom icon navigation. I would clarify their separate roles and make the current location explicit.' },
      { title: 'Improve reading contrast', body: 'Sculpture imagery sits behind interface text. I would test quieter image treatment, text contrast and readable type sizes.' },
      { title: 'Check content accuracy', body: 'The event list includes February 29, 2026, which is not a valid date. I would audit dates, labels, spelling and sample data before testing.' },
      { title: 'Test the core value first', body: 'I would ask people to find an event, explain guest access and share a visit. Collecting would be tested as an optional extension.' },
    ] satisfies AicPoint[],
    note: 'These are proposed next steps. No usability testing or adoption results are part of this project.',
  },

  outcome: {
    label: 'Outcome + reflection',
    kicker: 'What I take forward',
    title: 'Useful technology starts with a clear need.',
    lead: 'I contributed interviews, response review, journey mapping, Figma screens and presentation slides to a team research and concept project.',
    body: 'The strongest part of the work is the research story: time, cost and coordination can shape the visit before anyone reaches a gallery. The next step is to test whether our concept actually reduces that friction.',
    closing: ['Research informs the direction.', 'Testing has to earn the claims.'],
    recordLabel: 'Project record',
    record: ['Academic group project', 'DePaul University', 'UXD 260: Research & Evaluation', 'Spring 2026'],
    sourcesLabel: 'Source materials',
    sources: [
      'Our team’s research presentation: method, journey, principles and interface rationale.',
      'The original 26-page screen export, which includes light and dark versions of the same flows.',
    ],
    affiliation: 'Screen artwork and institutional branding are shown as part of the original academic concept. No official affiliation is implied.',
    pdf: {
      href: `${base}/aic-museum-experience-case-study.pdf`,
      label: 'Download case study PDF',
      detail: '12 pages · 4.7 MB',
    },
  },
}
