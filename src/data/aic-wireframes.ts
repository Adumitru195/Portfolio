import type { WireElement, WireScreen } from '@/types/aic'

// Retrospective low-fidelity reconstructions of the team's original screens.
//
// Each screen was measured from its original export (kept privately in
// UX Projects/AIC Museum Experience/originals/screen-exports/) on a 100 px grid,
// in the export's own pixel coordinates (786 px wide). Layout, controls,
// hierarchy and text are reproduced; colour, photography and artwork are not.
// Undocumented images (sculpture photographs, the museum logo, NFT artwork and
// a profile photo) appear as hatched "not reproduced" areas. Real artist and
// collection names are replaced by bracketed placeholders. These are drawings
// made for this case study, not Figma exports, and nothing here is interactive.

const W = 786
const H = 1704

/** Search bar, avatar, tabs and header rule shared by the signed-in screens. */
function header(search: string, trailing: WireElement): WireElement[] {
  return [
    { t: 'dot', cx: 81, cy: 158, r: 40, fill: 'omit' },
    { t: 'box', x: 151, y: 109, w: 482, h: 93, r: 46, fill: 'none' },
    { t: 'icon', name: 'search', x: 205, y: 155, size: 34 },
    { t: 'text', x: 250, y: 168, s: search, size: 34, tone: 'muted' },
    trailing,
    { t: 'text', x: 116, y: 310, s: 'Market', size: 33, anchor: 'middle', tone: 'muted' },
    { t: 'text', x: 286, y: 310, s: 'Map', size: 33, anchor: 'middle', tone: 'muted' },
    { t: 'text', x: 455, y: 310, s: 'Events', size: 33, anchor: 'middle', tone: 'muted' },
    { t: 'text', x: 659, y: 310, s: 'Rewards', size: 33, anchor: 'middle', tone: 'muted' },
    { t: 'line', x1: 0, y1: 360, x2: W, y2: 360 },
  ]
}

/** The four-icon bottom navigation, with no text labels (as in the original). */
function bottomNav(y: number, ruleY: number): WireElement[] {
  return [
    { t: 'line', x1: 0, y1: ruleY, x2: W, y2: ruleY },
    { t: 'icon', name: 'home', x: 128, y, size: 60, strong: true },
    { t: 'icon', name: 'search', x: 302, y, size: 54 },
    { t: 'icon', name: 'bell', x: 475, y, size: 54 },
    { t: 'icon', name: 'trend', x: 655, y, size: 58 },
  ]
}

function lines(x: number, y: number, step: number, size: number, texts: string[], extra: Partial<Extract<WireElement, { t: 'text' }>> = {}): WireElement[] {
  return texts.map((s, i) => ({ t: 'text', x, y: y + i * step, s, size, anchor: 'middle', ...extra }) as WireElement)
}

export const wireframes: Record<string, WireScreen> = {
  welcome: {
    id: 'welcome',
    source: 'app-01',
    title: 'Welcome',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of the first onboarding screen: four centred lines reading “Welcome to the Art Institute of Chicago, Home of the finest Portraits, Sculptures, Architecture, and NFTS”, a large square museum logo (not reproduced), a full-width Next button and three progress dots with the first one active.',
    elements: [
      ...lines(393, 300, 48, 36, ['Welcome to the Art Institute', 'of Chicago, Home of the finest', 'Portraits, Sculptures, Architecture,', 'and NFTS'], { weight: 600, tone: 'strong' }),
      { t: 'omit', x: 230, y: 690, w: 326, h: 326, r: 14, label: 'Museum logo' },
      { t: 'box', x: 116, y: 1176, w: 584, h: 114, r: 14, fill: 'solid', label: 'Next', size: 38 },
      { t: 'dot', cx: 366, cy: 1364, r: 14, fill: 'solid' },
      { t: 'dot', cx: 408, cy: 1364, r: 14, fill: 'tint' },
      { t: 'dot', cx: 450, cy: 1364, r: 14, fill: 'tint' },
    ],
  },
  access: {
    id: 'access',
    source: 'app-03',
    title: 'Choose how to enter',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of the access screen: a back arrow, the line “To use the market and other features, please login or signup”, a large square museum logo (not reproduced), then three stacked full-width buttons: Login (filled), Sign Up and Continue as Guest (both lighter), and three progress dots with the last one active.',
    elements: [
      { t: 'icon', name: 'chevron-left', x: 50, y: 210, size: 40 },
      ...lines(393, 292, 50, 38, ['To use the market and other', 'features, please login or signup'], { tone: 'strong' }),
      { t: 'omit', x: 230, y: 470, w: 328, h: 328, r: 14, label: 'Museum logo' },
      { t: 'box', x: 100, y: 932, w: 586, h: 114, r: 14, fill: 'solid', label: 'Login', size: 38 },
      { t: 'box', x: 100, y: 1088, w: 586, h: 114, r: 14, fill: 'tint', label: 'Sign Up', size: 38 },
      { t: 'box', x: 100, y: 1242, w: 586, h: 114, r: 14, fill: 'tint', label: 'Continue as Guest', size: 38 },
      { t: 'dot', cx: 368, cy: 1428, r: 14, fill: 'tint' },
      { t: 'dot', cx: 408, cy: 1428, r: 14, fill: 'tint' },
      { t: 'dot', cx: 448, cy: 1428, r: 14, fill: 'solid' },
    ],
  },
  explainNft: {
    id: 'explain-nft',
    source: 'app-04',
    title: 'What is an NFT?',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of an onboarding screen: a small museum logo (not reproduced) at top left, the serif heading “What is an NFT?”, a nine-line paragraph defining a non-fungible token, and a “Lets Go!” button.',
    elements: [
      { t: 'omit', x: 38, y: 220, w: 164, h: 164, r: 12, label: 'Logo' },
      { t: 'text', x: 393, y: 618, s: 'What is an NFT?', size: 54, anchor: 'middle', serif: true, tone: 'strong' },
      ...lines(393, 748, 48, 34, [
        'An NFT, or non-fungible token, is a',
        'unique digital identifier recorded on a',
        'blockchain that certifies ownership and',
        'authenticity of a specific digital or',
        'physical asset, such as art, music, or',
        'collectibles. Unlike cryptocurrencies,',
        'NFTs cannot be copied, substituted, or',
        'subdivided, making each one a one-of-a-',
        'kind, verifiable asset.',
      ]),
      { t: 'box', x: 242, y: 1406, w: 300, h: 126, r: 16, fill: 'solid', label: 'Lets Go!', size: 40 },
    ],
  },
  home: {
    id: 'home',
    source: 'app-06',
    title: 'Home: upcoming events',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of the home screen: a profile photo (not reproduced), a Search bar and a small round museum logo (not reproduced); a Market, Map, Events, Rewards row; an Upcoming Events heading with a filter icon above four dated rows (Phygital Exhibit 2/23/26, Raffle giveaway 2/29/26, an artist’s exhibit 3/5/26, Exclusive exhibit 4/15/26), each with a thumbnail (not reproduced) and an arrow; a Curated Collections panel; and a four-icon bottom bar without labels.',
    elements: [
      ...header('Search', { t: 'dot', cx: 703, cy: 158, r: 40, fill: 'omit' }),
      { t: 'text', x: 42, y: 480, s: 'Upcoming Events', size: 50, serif: true, tone: 'strong' },
      { t: 'icon', name: 'filter', x: 712, y: 468, size: 44 },
      ...[
        ['Phygital Exhibit', '2/23/26'],
        ['Raffle giveaway', '2/29/26'],
        ['[Artist name] exhibit', '3/5/26'],
        ['Exclusive exhibit', '4/15/26'],
      ].flatMap(([title, date], i): WireElement[] => {
        const y = [587, 728, 866, 1007][i]
        return [
          { t: 'omit', x: 39, y: y - 49, w: 98, h: 98, r: 14 },
          { t: 'text', x: 165, y: y + 12, s: title, size: 36, tone: 'strong' },
          { t: 'text', x: 700, y: y + 12, s: date, size: 30, anchor: 'end', tone: 'muted' },
          { t: 'icon', name: 'chevron-right', x: 740, y, size: 26 },
        ]
      }),
      { t: 'box', x: 32, y: 1116, w: 715, h: 404, r: 22, fill: 'none' },
      { t: 'text', x: 393, y: 1182, s: 'Curated Collections', size: 48, anchor: 'middle', serif: true, tone: 'strong' },
      ...[1293, 1411].flatMap((y): WireElement[] => [
        { t: 'omit', x: 63, y: y - 49, w: 98, h: 98, r: 14 },
        { t: 'text', x: 190, y: y + 12, s: '[Collection name]', size: 34, tone: 'muted' },
        { t: 'icon', name: 'chevron-right', x: 700, y, size: 24 },
      ]),
      ...bottomNav(1612, 1520),
    ],
  },
  collection: {
    id: 'collection',
    source: 'app-07',
    title: 'My collection',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of the collection screen: a profile photo (not reproduced), a “Search Events” bar and a settings icon; the Market, Map, Events, Rewards row; a My Collection heading with share and QR icons; a wallet address; then collected items (not reproduced) grouped under the dates Feb 16, 2026, Jan 2, 2026 and Sep 8, 2025, with an “Event date” sort control and a four-icon bottom bar.',
    elements: [
      ...header('Search Events', { t: 'icon', name: 'gear', x: 701, y: 155, size: 56 }),
      { t: 'text', x: 40, y: 482, s: 'My Collection', size: 50, serif: true, tone: 'strong' },
      { t: 'icon', name: 'share', x: 627, y: 466, size: 46 },
      { t: 'icon', name: 'qr', x: 719, y: 466, size: 46 },
      { t: 'text', x: 40, y: 582, s: '0X437RYBYEC3R...FJADUFV87GC', size: 31, weight: 600, tone: 'strong' },
      { t: 'text', x: 40, y: 692, s: 'Feb 16, 2026', size: 40, tone: 'strong' },
      { t: 'text', x: 480, y: 677, s: 'Event date', size: 32 },
      { t: 'icon', name: 'filter', x: 717, y: 665, size: 40 },
      { t: 'dot', cx: 97, cy: 828, r: 58, fill: 'omit' },
      { t: 'text', x: 40, y: 990, s: 'Jan 2, 2026', size: 40, tone: 'strong' },
      { t: 'dot', cx: 97, cy: 1125, r: 55, fill: 'omit' },
      { t: 'dot', cx: 251, cy: 1125, r: 55, fill: 'omit' },
      { t: 'dot', cx: 406, cy: 1125, r: 55, fill: 'omit' },
      { t: 'text', x: 40, y: 1285, s: 'Sep 8, 2025', size: 40, tone: 'strong' },
      { t: 'dot', cx: 97, cy: 1420, r: 58, fill: 'omit' },
      ...bottomNav(1603, 1508),
    ],
  },
  pass: {
    id: 'pass',
    source: 'app-12',
    title: 'NFT pass',
    width: W,
    height: H,
    photoBackground: true,
    description:
      'Reconstruction of the pass screen: a back arrow and a small museum logo (not reproduced), a sculpture photograph of two lions (not reproduced), a large QR-style code (drawn here as an outline), and the words “NFT PASS” in two large serif lines.',
    elements: [
      { t: 'icon', name: 'chevron-left', x: 50, y: 166, size: 42 },
      { t: 'omit', x: 658, y: 136, w: 86, h: 84, r: 12 },
      { t: 'omit', x: 40, y: 271, w: 706, h: 341, r: 0, label: 'Sculpture photograph' },
      { t: 'box', x: 111, y: 658, w: 560, h: 558, r: 0, fill: 'none', label: 'QR-style code', size: 34 },
      { t: 'text', x: 393, y: 1400, s: 'NFT', size: 150, anchor: 'middle', serif: true, tone: 'strong' },
      { t: 'text', x: 393, y: 1592, s: 'PASS', size: 150, anchor: 'middle', serif: true, tone: 'strong' },
    ],
  },
}
