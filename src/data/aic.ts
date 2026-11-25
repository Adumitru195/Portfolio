import type {
  Artwork,
  ConceptFlow,
  ConnectionRow,
  Finding,
  FollowUpDesign,
  JourneyStage,
  MetaItem,
  ReflectionNote,
  SupportLevel,
  TestPlan,
} from '@/types/aic'
import { wireframes } from '@/data/aic-wireframes'

const base = '/Portfolio/projects/aic-museum-experience'

// Evidence: the team's 24-slide research presentation (UXD 260)
// and the 26-screen Figma export, both kept privately in
// UX Projects/AIC Museum Experience/originals/. Interview transcripts, notes
// and the Figma file are not available, so every research fact here is as
// documented in the presentation. See docs/RIGHTS-REVIEW.md there.
// The academic term is not shown: portfolio records disagree (Spring 2025 in
// the first portfolio entry, Spring 2026 in the later PDF) and no course record
// survives. The deck itself refers to "early 2026".

// Presentation artwork, downloaded by scripts/aic-case-study-assets.py after
// the museum's API confirmed each record is public domain (CC0 1.0).
function artwork(file: string, size: [number, number], rest: Omit<Artwork, 'src' | 'width' | 'height'>): Artwork {
  return {
    ...rest,
    src: {
      sm: `${base}/artworks/${file}-sm.webp`,
      md: `${base}/artworks/${file}-md.webp`,
      lg: `${base}/artworks/${file}-lg.webp`,
    },
    width: size[0],
    height: size[1],
  }
}

export const artworks = {
  grandeJatte: artwork('seurat-grande-jatte', [1100, 737], {
    title: 'A Sunday on La Grande Jatte — 1884',
    artist: 'Georges Seurat (French, 1859–1891)',
    date: '1884–86, border added 1888–89',
    medium: 'Oil on canvas',
    reference: '1926.224',
    credit: 'Helen Birch Bartlett Memorial Collection',
    url: 'https://www.artic.edu/artworks/27992',
    alt: 'Georges Seurat’s A Sunday on La Grande Jatte: Parisians relaxing on a sunlit riverbank, painted in small dots of colour, with strollers, parasols and boats on the water.',
  }),
  parisStreet: artwork('caillebotte-paris-street', [1100, 854], {
    title: 'Paris Street; Rainy Day',
    artist: 'Gustave Caillebotte (French, 1848–1894)',
    date: '1877',
    medium: 'Oil on canvas',
    reference: '1964.336',
    credit: 'Charles H. and Mary F. S. Worcester Collection',
    url: 'https://www.artic.edu/artworks/20684',
    alt: 'Gustave Caillebotte’s Paris Street; Rainy Day: a couple under an umbrella walking toward the viewer across a wide, wet Paris intersection, with other pedestrians and a lamppost.',
  }),
}

export const supportLabels: Record<SupportLevel, { label: string; short: string }> = {
  response: { label: 'Response to a finding', short: 'Response' },
  hypothesis: { label: 'Design hypothesis', short: 'Hypothesis' },
  partial: { label: 'Partly supported', short: 'Partial' },
  gap: { label: 'Finding not addressed', short: 'Gap' },
  speculative: { label: 'Speculative, not from the interviews', short: 'Speculative' },
}

export const aic = {
  documentTitle: 'AIC Museum Experience · Andrew Dumitru',

  opening: {
    eyebrow: 'Academic team project · UX research',
    titleLines: ['Beyond', 'the gallery.'],
    project: 'AIC Museum Experience',
    lede: 'A student research study into why young adults put off museum visits, and the mobile concept a five-person team proposed in response.',
    meta: [
      { label: 'Course', value: 'UXD 260: Research & Evaluation' },
      { label: 'School', value: 'DePaul University' },
      { label: 'Role', value: 'UX Research & UX/UI Design' },
      { label: 'Team', value: 'Five-person student team' },
      { label: 'Format', value: 'Interview study, static mobile concept and individual follow-up' },
    ] satisfies MetaItem[],
    disclaimer:
      'Student coursework. The concept is not an Art Institute of Chicago product, and the project is not affiliated with, commissioned by or endorsed by the museum. The paintings on this page are public-domain works from the museum’s open-access collection, used here as presentation artwork. They were not part of the original project.',
    artwork: artworks.grandeJatte,
  },

  contributions: {
    title: 'Who did what',
    team: {
      label: 'The five-person team',
      items: [
        'Planned and ran twelve semi-structured interviews',
        'Synthesised the findings and mapped the visitor journey',
        'Proposed the concept, including its NFT direction',
        'Designed the static Figma screens and the presentation',
      ],
    },
    andrew: {
      label: 'Andrew',
      items: [
        'Conducted interviews and reviewed responses, as one of the interviewers',
        'Contributed to the visitor journey map',
        'Designed Figma screens for the team concept and created presentation slides',
        'Afterwards, on his own: redesigned guest access, event discovery and the digital keepsake',
      ],
    },
    note: 'Individual credit for specific original screens is not recorded, so the team’s screens are attributed to the team.',
  },

  question: {
    room: 'The question',
    title: 'Why does a museum visit feel like such a big decision?',
    body: 'The team set out to understand how young adults experience museums and cultural outings: what draws them in, what keeps them away, and where a phone might genuinely help.',
    focusLabel: 'The interviews explored',
    focus: ['Social behaviour and leisure habits', 'Perceptions of museums', 'Technology use during outings', 'Barriers to attendance'],
  },

  listening: {
    room: 'Listening',
    title: 'Twelve conversations, as the team documented them.',
    stats: [
      { value: '12', label: 'semi-structured interviews' },
      { value: '18–25', label: 'participant ages' },
      { value: '20–30', label: 'minutes each' },
    ],
    sample: 'College students and young professionals across several majors, interviewed remotely and in person. The team recruited a mix of frequent visitors, occasional visitors and people who tend to avoid museums.',
    sourceNote:
      'These figures come from the team’s research presentation. The original transcripts and notes are not available, so the interviews can no longer be re-read or re-counted.',
    audienceNote:
      'The people interviewed were 18 to 25. Later in the project the team described the concept’s intended audience as 16 to 25. That is a proposed audience, not the group that was interviewed.',
    theme: 'Again and again, a museum visit came across as a commitment to sign up for, not a casual outing.',
    themeNote: 'Paraphrased from the team’s synthesis. No participant is named or quoted.',
  },

  findings: {
    room: 'What we heard',
    title: 'Six patterns from the interviews.',
    intro: 'The team’s qualitative synthesis. These are themes from twelve conversations, not measurements of how common each view is among young adults.',
    items: [
      { title: 'A visit feels like a commitment', body: 'Participants preferred flexible, low-pressure outings to a visit that felt like a major undertaking.' },
      { title: 'Coordinating a group gets in the way', body: 'Finding a time and organising friends discouraged spontaneous visits.' },
      { title: 'Cost shapes the decision', body: 'Free days and discounts made a visit more appealing.' },
      { title: 'Exhibits can feel passive', body: 'Text-heavy displays drained energy and interest.' },
      { title: 'Technology has to earn its place', body: 'A phone was welcome when it added something to the visit, not when it added work.' },
      { title: 'Discovery happens socially', body: 'TikTok, Instagram and friends were how people heard about things to do.' },
    ] satisfies Finding[],
    note: 'No counts are given for individual themes: the presentation does not record how many participants raised each one.',
  },

  journey: {
    room: 'The visit, mapped',
    title: 'The low points come before the art.',
    intro: 'Reconstructed from the team’s visitor journey map. The emotional states are the team’s qualitative reading of the interviews, not measured scores.',
    stages: [
      { stage: 'Discovery', state: 'Neutral', notes: ['Finds an exhibit through social media', 'Interested in something new to do', 'Looking for a break from routine'] },
      { stage: 'Planning', state: 'Frustrated', notes: ['Checks ticket prices', 'Coordinates schedules with others', 'Questions whether the visit is worth it', 'Feels overwhelmed and hesitant'] },
      { stage: 'Arrival', state: 'Frustrated', notes: ['Tries to find parking', 'Navigates an unfamiliar space', 'Scans a digital ticket', 'Energy drops before the visit begins'] },
      { stage: 'Engagement', state: 'Neutral', notes: ['Walks through exhibits', 'Takes photos and short videos', 'Limited interactivity', 'Passive viewing'] },
      { stage: 'Exit and reflection', state: 'Neutral', notes: ['Leaves the museum', 'Unsure whether the time and money were worthwhile', 'The experience feels short-lived', 'Inspiration does not extend beyond the visit'] },
    ] satisfies JourneyStage[],
    opportunity: 'The clearest opportunities sit before the visit: reduce the effort of planning and arriving, then give people a reason to come back.',
  },

  connections: {
    room: 'From finding to feature',
    title: 'Which parts of the concept the research actually supports.',
    intro: 'The team’s concept combined responses to the interviews with ideas from elsewhere. Reading each feature against the documented findings shows which is which.',
    principlesLabel: 'The team’s design principles',
    principles: ['Frictionless entry', 'Mobile-first engagement', 'Optional depth of learning', 'Shareable social moments'],
    rows: [
      {
        feature: 'Event discovery on the home screen',
        level: 'response',
        evidence: 'Planning friction; discovery happens socially',
        note: 'Upcoming events and their dates lead the home screen, so a visit can start from what is on.',
      },
      {
        feature: 'Guest access and a shorter onboarding',
        level: 'hypothesis',
        evidence: 'Technology has to earn its place',
        note: 'A reasonable inference, not something participants asked for. The original onboarding still opened with several screens, one of them explaining NFTs.',
      },
      {
        feature: 'Map, entry pass and sharing',
        level: 'partial',
        evidence: 'Arrival friction; group outings',
        note: 'Map exists only as a navigation tab; no map screen was designed. The pass and the share action relate to arrival and to visiting with friends, but the concept ties both to NFTs.',
      },
      {
        feature: 'Cost',
        level: 'gap',
        evidence: 'Cost shapes the decision',
        note: 'No screen surfaces free days, discounts or prices.',
      },
      {
        feature: 'Coordinating a group',
        level: 'gap',
        evidence: 'Coordinating a group gets in the way',
        note: 'No feature helps friends choose a time or plan a visit together.',
      },
      {
        feature: 'NFT market, wallet, minting and rewards',
        level: 'speculative',
        evidence: 'Not among the documented findings',
        note: 'The team proposed NFTs as a speculative product direction; it was their own idea, not a course requirement. The documented findings did not establish a need for blockchain technology, digital ownership or a marketplace.',
      },
    ] satisfies ConnectionRow[],
  },

  concept: {
    room: 'The original concept',
    title: 'Three flows from the team’s static concept.',
    intro: 'The team designed static screens in Figma, in light and dark versions. No working prototype is available, and the concept was never built as an app.',
    labelsTitle: 'How to read these screens',
    labels: [
      { name: 'Reconstruction', body: 'A low-fidelity drawing made for this case study from the original export. Layout, controls and text are reproduced; colour and imagery are not.' },
      { name: 'Original, cropped', body: 'Part of an original Figma export, unaltered, cut to leave out material whose source is not recorded.' },
      { name: 'Not reproduced', body: 'Hatched areas mark photographs, the museum logo, NFT artwork and a profile photo that cannot be shown.' },
    ],
    whyNote:
      'Most original screens are shown as reconstructions because sculpture photography with no recorded source fills their backgrounds, and several also show the Art Institute’s logo, real NFT artwork or a stranger’s profile photo. The originals are kept privately and are unchanged.',
    flows: [
      {
        id: 'onboarding',
        title: 'Guest access and onboarding',
        level: 'hypothesis',
        body: 'Three onboarding screens lead to a choice of Login, Sign Up or Continue as Guest. Guest access was there, but it came last of three buttons, after an introduction that mentions NFTs on its first screen.',
        visuals: [
          { kind: 'reconstruction', screen: wireframes.welcome },
          { kind: 'reconstruction', screen: wireframes.access },
          { kind: 'reconstruction', screen: wireframes.explainNft },
        ],
      },
      {
        id: 'discovery',
        title: 'Event discovery',
        level: 'response',
        body: 'The home screen leads with upcoming events and their dates, answering the planning friction in the research. It shares the screen with the market, rewards and curated NFT collections, and the bottom bar uses icons without labels.',
        visuals: [{ kind: 'reconstruction', screen: wireframes.home }],
      },
      {
        id: 'collecting',
        title: 'Optional digital collecting',
        level: 'speculative',
        body: 'Collected items are grouped by visit date in a wallet, each with an edition number and a share action, and entry uses an NFT pass. Sharing and the pass touch real findings about going with friends and arriving; ownership and the blockchain do not.',
        visuals: [
          { kind: 'reconstruction', screen: wireframes.collection },
          {
            kind: 'original-crop',
            id: 'collectible',
            title: 'Collectible detail',
            src: `${base}/original/collectible-detail-crop.webp`,
            width: 706,
            height: 1031,
            alt: 'Lower part of the original collectible detail screen on white: “52/100”, a wallet address, “Minted on Ethereum blockchain”, “Holders will be rewarded with free collections and events. Follow the roadmap to see what’s next!”, a transaction link, “Minted: Jan 2, 2026”, “You and 70 others were there” and an outlined Share button.',
            note: 'Cropped below the collectible illustration, whose source is not recorded.',
          },
          { kind: 'reconstruction', screen: wireframes.pass },
        ],
      },
    ] satisfies ConceptFlow[],
  },

  followUp: {
    room: 'Andrew’s follow-up',
    title: 'A clearer path into the visit.',
    intro:
      'After the team project, Andrew redesigned the three flows on his own, starting from the research rather than the technology. These are individual designs, separate from the team concept.',
    sourceLabel: 'Individual follow-up design · shown as it appears in Andrew’s case-study PDF',
    designs: [
      {
        id: 'guest-access',
        before: wireframes.access,
        title: 'Guest access',
        src: { md: `${base}/follow-up/guest-access-md.webp`, lg: `${base}/follow-up/guest-access-lg.webp` },
        width: 901,
        height: 855,
        alt: 'Follow-up design titled “Your visit, your way.”: the line “Discover events and keep a memory of your visit.”, a filled “Continue as guest” button above an outlined “Log in / Sign up” button, and the note “Explore first. An account is optional.”',
        change: 'Guest access moves from the last of three buttons to the primary action, and the introduction shrinks to one line about events and keeping a memory. No NFT explanation stands between a visitor and the museum.',
        research: 'Technology has to earn its place, and a visit already feels like a commitment. An account should not be one more thing to sign up for.',
        level: 'hypothesis',
      },
      {
        id: 'event-discovery',
        before: wireframes.home,
        title: 'Event discovery',
        src: { md: `${base}/follow-up/event-discovery-md.webp`, lg: `${base}/follow-up/event-discovery-lg.webp` },
        width: 901,
        height: 855,
        alt: 'Follow-up design titled “Upcoming events”: Today, This week and All events filters with Today selected, two events with dates and times (Gallery highlights, Mar 05, 2026, 2:00 PM; Art after hours, Mar 12, 2026, 5:00 PM), each with a View details link, and a labelled navigation row: Events, Explore, My visit.',
        change: 'Date filters sit with the events, each event shows its date and time, and the navigation has text labels. The market, rewards and collections leave the events screen.',
        research: 'Planning friction: people check timing and coordinate before committing. Filtering by today or this week supports the flexible, low-pressure outings participants preferred.',
        level: 'response',
      },
      {
        id: 'keepsake',
        before: wireframes.collection,
        title: 'Optional digital keepsakes',
        src: { md: `${base}/follow-up/keepsake-md.webp`, lg: `${base}/follow-up/keepsake-lg.webp` },
        width: 901,
        height: 855,
        alt: 'Follow-up design titled “A memory to keep.”: the lines “Save a digital keepsake from your visit. Browse the museum without collecting anything.”, a filled “Explore keepsakes” button, a “Skip for now” link, and the note “Concept content / not a live service”.',
        change: 'The NFT wallet becomes an optional keepsake with a clear way to skip it. There is no blockchain, price or marketplace on the screen.',
        research: 'Speculative: the interviews did not ask for collecting. The keepsake keeps the idea small and optional so that testing can show whether it adds anything to a visit.',
        level: 'speculative',
      },
    ] satisfies FollowUpDesign[],
    sampleNote: 'Event names, dates and times are sample content. None of these designs is a live service.',
  },

  evaluation: {
    room: 'Testing what we assumed',
    title: 'A plan for the usability testing that hasn’t happened yet.',
    banner: 'No usability testing was conducted. There are no observed results for this concept.',
    intro: 'Three studies would compare the team’s original flows with Andrew’s follow-up designs, using clickable versions of both. Recruit people like the original sample: ages 18 to 25, a mix of frequent, occasional and museum-avoidant visitors.',
    plans: [
      {
        area: 'Event discovery',
        question: 'Can a first-time visitor find an event that suits them and understand when it is?',
        task: 'Find something happening this month and tell us its date and what it involves.',
        observe: ['Completion without help, recorded separately from completion with help', 'Where people look first, and any wrong turns', 'Comments about dates, details and cost'],
        success: 'Agreed before testing, for example naming the event and its date without assistance.',
      },
      {
        area: 'Guest access',
        question: 'Can people start without creating an account, and do they understand what an account adds?',
        task: 'Start using the app without signing up.',
        observe: ['Whether the guest option is noticed, and how long it takes', 'Hesitation or requests for help', 'What people expect an account to be for'],
        success: 'Entering as a guest without help, and explaining what signing up would change.',
      },
      {
        area: 'Optional collecting',
        question: 'Do visitors understand digital collecting, and does it add anything to a visit?',
        task: 'After the introduction, explain in your own words what collecting means here and whether you would use it.',
        observe: ['Accuracy of the explanation', 'Confusion about cost, crypto or ownership', 'Whether it reads as part of the visit or a distraction from the art'],
        success: 'A correct explanation. Interest is recorded in participants’ own words, not as a target.',
      },
    ] satisfies TestPlan[],
  },

  reflection: {
    room: 'Looking back',
    title: 'Research informs the direction. Testing has to earn the claims.',
    note: 'A retrospective reading of the documented research and the original screens, written for this case study.',
    notes: [
      { eyebrow: 'What held up', title: 'The research found practical problems', body: 'Time, cost, coordination and the effort of arriving are concrete and designable. Event discovery answered one of them directly.' },
      { eyebrow: 'A design lesson', title: 'Name speculation as speculation', body: 'The team explored NFTs as a speculative product direction, and it came to fill much of the concept. The interviews never established a need for it. Labelling an idea by its evidence from the first sketch keeps an exciting direction from crowding out the problems people actually described.' },
      { eyebrow: 'What was missed', title: 'The two clearest barriers went unanswered', body: 'Nothing in the concept tackles cost or helps a group plan a visit, though both stood out in the interviews.' },
      { eyebrow: 'Next time', title: 'Start from the strongest findings', body: 'The follow-up began there: guest access first, events by date, and collecting reduced to an optional keepsake. Cost and group planning are still open, and testing has to show whether any of it helps.' },
    ] satisfies ReflectionNote[],
  },

  about: {
    title: 'About this case study',
    items: [
      'Research facts are as documented in the team’s presentation; transcripts and interview notes are not available.',
      'No participant is named or quoted, and no identifying details are published.',
      'Claims in the team presentation about the museum’s finances and about NFT market trends are not repeated here: they were not sourced.',
      'Original team screens are shown as labelled low-fidelity reconstructions or an unaltered crop, because their imagery has no recorded source or permission. Andrew’s follow-up designs are shown as they appear in his case-study PDF.',
    ],
    creditsLabel: 'Presentation artwork',
    credits: [artworks.grandeJatte, artworks.parisStreet],
    licence: 'Public domain. Image and data from the Art Institute of Chicago open-access collection, CC0 1.0.',
  },
}
