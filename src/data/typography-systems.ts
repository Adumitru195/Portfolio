import type { BookPage, DownloadLink, PrintFigure, TypographySystemsPresentation } from '@/types/typography'

const base = '/Portfolio/projects/typography-systems'

// Rendered by scripts/typography-systems-assets.py. Every PDF page exists at
// three heights (560 / 1100 / 2200 px); spreads are twice as wide as single pages.
const SIZES = {
  single: { sm: 408, md: 800, lg: 1600 },
  spread: { sm: 815, md: 1600, lg: 3200 },
}

interface PageSpec {
  kind: 'single' | 'spread'
  title: string
  alt: string
}

function bookPages(folder: string, specs: PageSpec[]): BookPage[] {
  return specs.map((spec, i) => {
    const n = String(i + 1).padStart(2, '0')
    const w = SIZES[spec.kind]
    return {
      id: `${folder}-p${n}`,
      kind: spec.kind,
      title: spec.title,
      alt: spec.alt,
      label: `PDF page ${i + 1} of ${specs.length}`,
      small: `${base}/${folder}/p${n}-sm.webp`,
      smallWidth: w.sm,
      src: `${base}/${folder}/p${n}-md.webp`,
      width: w.md,
      height: 1100,
      large: `${base}/${folder}/p${n}-lg.webp`,
      largeWidth: w.lg,
    }
  })
}

function detail(name: string, size: { md: [number, number]; lg: [number, number] }, alt: string): PrintFigure {
  return {
    src: `${base}/details/${name}-md.webp`,
    width: size.md[0],
    height: size.md[1],
    large: `${base}/details/${name}-lg.webp`,
    largeWidth: size.lg[0],
    alt,
  }
}

function singlePage(name: string, alt: string): PrintFigure {
  return detail(name, { md: [800, 1100], lg: [1600, 2200] }, alt)
}

export const book1Pages = bookPages('book-1', [
  {
    kind: 'single',
    title: 'Cover, part 1',
    alt: 'Book 1 cover: a small course credit block at the top and an oversized “Book 1” with “part 1” set low on a white page.',
  },
  {
    kind: 'spread',
    title: 'Two aligned compositions',
    alt: 'Two-page spread of the lecture series announcement, each page with a horizontal title, an aligned description and a stacked list of lectures.',
  },
  {
    kind: 'spread',
    title: 'Rotated program',
    alt: 'Two-page spread: on the left an aligned layout with a dropped initial; on the right the description and lecture list rotated to run vertically beneath a horizontal title.',
  },
  {
    kind: 'spread',
    title: 'Diagonal and vertical type',
    alt: 'Two-page spread with the department name set vertically along the left edge, the description set on a diagonal, and lecture dates rotated in columns on the right page.',
  },
  {
    kind: 'spread',
    title: 'Separated groups',
    alt: 'Two-page spread: a stacked one-word-per-line title on the left page, and on the right the lecture list, description and title pulled apart into separate groups.',
  },
  {
    kind: 'spread',
    title: 'Ruled columns',
    alt: 'Two-page spread in which heavy horizontal rules divide the description and lecture listings into columns.',
  },
  {
    kind: 'spread',
    title: 'Cover, part 2',
    alt: 'Two-page spread: the “Book 1, part 2” divider on the left and an aligned announcement layout on the right.',
  },
  {
    kind: 'spread',
    title: 'Vertical description',
    alt: 'Two-page spread: an aligned layout on the left; on the right the description is rotated to run up the page beside the lecture list.',
  },
  {
    kind: 'spread',
    title: 'Black block and rotated columns',
    alt: 'Two-page spread: a solid black block anchors the left page under a vertical department name; the right page sets the program in rotated columns.',
  },
  {
    kind: 'spread',
    title: 'Cover, part 3',
    alt: 'Two-page spread: an aligned announcement layout on the left and the “Book 1, part 3” divider on the right.',
  },
  {
    kind: 'spread',
    title: 'Blue field and pink block',
    alt: 'Two-page spread: a saturated blue page with light and yellow type and a vertical lecture list, beside a white page that gathers the program inside a pale pink block.',
  },
  {
    kind: 'spread',
    title: 'Pale green bands',
    alt: 'Two-page spread: small rotated text on the left page; on the right, lectures set in pale green bands beside a large vertical department name.',
  },
  {
    kind: 'spread',
    title: 'Triangle and rotated list',
    alt: 'Two-page spread: a pale green panel and triangle frame the program on the left; the right page stacks the department name and sets the lecture list rotated.',
  },
])

export const book2Pages = bookPages('book-2', [
  {
    kind: 'single',
    title: 'Front cover',
    alt: 'ONE-X front cover on warm paper: a tall black and burgundy “ONE-X” title, “A Typography Study of 3 Days Grace”, design and course credits, and a burgundy vertical rule.',
  },
  {
    kind: 'spread',
    title: 'Back and front cover',
    alt: 'ONE-X cover spread: a warm paper back cover reading “Every album represents a chapter. Together, they tell the story”, beside the front cover reversed out of black.',
  },
  {
    kind: 'spread',
    title: 'Introduction · The sound of Three Days Grace (04)',
    alt: 'ONE-X spread: an italic “Introduction” page with body copy, beside page 04 with a stacked “The Sound of Three Days Grace” title, a pale oversized 04 and two text columns.',
  },
  {
    kind: 'spread',
    title: 'Adam Gontier (05) · Barry Stock (06)',
    alt: 'ONE-X member spread: page 05 with a portrait and the horizontal name “Adam Gontier”; page 06 with a guitarist portrait and the name “Barry Stock” set vertically; pale numerals 05 and 06.',
  },
  {
    kind: 'spread',
    title: 'Brad Walst (07) · Neil Sanderson (08)',
    alt: 'ONE-X member spread: page 07 with a large shaded italic 07 and the name “Brad Walst”; page 08 with “Neil Sanderson” over a portrait and the pull words “Pulse, Control and Impact”.',
  },
  {
    kind: 'spread',
    title: 'Matt Walst (09) · The five voices (10)',
    alt: 'ONE-X spread: page 09 with the name “Matt Walst” set vertically beside a portrait; page 10 with “The Five Voices” and a numbered list of the five members and their roles.',
  },
  {
    kind: 'spread',
    title: 'Lyrics: I Hate Everything About You (11) · Animal I Have Become (12)',
    alt: 'ONE-X lyrics spread on warm paper: two song titles set large in black and burgundy, each with a short description and centered lyric excerpt below a burgundy rule.',
  },
  {
    kind: 'spread',
    title: 'Lyrics: Pain (13) · The albums (14)',
    alt: 'ONE-X spread: page 13 with “Pain” in large burgundy capitals above a lyric excerpt; page 14 with the title “The Albums” and the line “A timeline of the band’s recorded work.”',
  },
  {
    kind: 'spread',
    title: 'Discography (15)',
    alt: 'ONE-X discography page 15: album years from 2003 to 2022 in burgundy with italic album titles, arranged in two columns around a vertical rule. The facing page is blank.',
  },
])

const pdf = (name: string, label: string, size: string, description: string): DownloadLink => ({
  href: `${base}/${name}`,
  label,
  size,
  description,
})

export const typographySystems: TypographySystemsPresentation = {
  opening: {
    eyebrow: 'Editorial design · Selected studies',
    title: 'Type sets the tone.',
    lede: 'Two studies in hierarchy, composition and editorial rhythm.',
    meta: [
      { label: 'Course', value: 'GD 232 Typography: Systems' },
      { label: 'School', value: 'DePaul University' },
      { label: 'Term', value: 'Spring 2026' },
      { label: 'Format', value: 'Two print studies' },
    ],
    cover: book2Pages[0],
  },
  overview: {
    title: 'One discipline. Two ways to explore it.',
    context:
      'Both books were made as academic work for GD 232 Typography: Systems at DePaul University in Spring 2026. They are two related studies, not two versions of one project: the first holds the content fixed and varies the typography, the second builds one consistent voice for a publication.',
    studies: [
      {
        number: 'Study 01',
        name: 'Book 1 · Typography explorations',
        heading: 'Hierarchy through variation',
        body: 'Layouts for the Sekisui House Kuma Lab Lecture Series reuse the same information while changing scale, alignment, orientation and emphasis. Repetition makes the differences in reading order visible.',
        image: book1Pages[1],
      },
      {
        number: 'Study 02',
        name: 'Book 2 · ONE-X',
        heading: 'An editorial identity',
        body: 'ONE-X applies a more consistent visual language to a music publication about Three Days Grace: member profiles, song spreads and an album timeline. Variation happens within a shared system.',
        image: book2Pages[3],
      },
    ],
    question: 'How can typography establish a clear reading order while giving each composition its own character?',
  },
  readingPaths: {
    title: 'Same content. Different reading paths.',
    intro:
      'Every page in Book 1 carries the same announcement: the department, the series title, a description of the lab, five lectures with dates, and the venue. Only the typography changes.',
    items: [
      {
        heading: 'A steady entry',
        body: 'A horizontal title and aligned text establish a predictable top-to-bottom sequence.',
        figure: singlePage(
          'b1-steady-entry',
          'Book 1 page with a horizontal two-line title, an aligned description and a stacked list of five lectures, read top to bottom.',
        ),
        source: 'Book 1, PDF page 2, left',
      },
      {
        heading: 'Direction as emphasis',
        body: 'Rotated information introduces a second reading direction and a more active composition.',
        figure: singlePage(
          'b1-direction',
          'Book 1 page where the description and lecture list are rotated ninety degrees beneath a horizontal title.',
        ),
        source: 'Book 1, PDF page 3, right',
      },
      {
        heading: 'Space as structure',
        body: 'Separated groups give the title, program and supporting details their own positions.',
        figure: singlePage(
          'b1-space',
          'Book 1 page with the lecture list at the top, the description in the middle, the series title below it and the department name at the bottom left, each group separated by open space.',
        ),
        source: 'Book 1, PDF page 5, right',
      },
    ],
  },
  contrast: {
    title: 'Changing emphasis changes the page.',
    intro: 'Across the book the content stays put while alignment, rotation, scale and color move the center of attention.',
    comparisons: [
      { lever: 'Alignment', note: 'Two aligned compositions: the title, description and program stay in one reading column.', page: book1Pages[1] },
      { lever: 'Rotation', note: 'Vertical and diagonal text pull the eye across the page before it settles into the lecture list.', page: book1Pages[3] },
      { lever: 'Scale', note: 'An oversized vertical department name takes the lead, and the lectures become a secondary layer.', page: book1Pages[11] },
      { lever: 'Color', note: 'A saturated blue field and a pale block create two different centers of attention on facing pages.', page: book1Pages[10] },
    ],
    notes: [
      {
        eyebrow: 'Observation',
        heading: 'Two different kinds of contrast',
        body: 'The blue composition uses light and yellow type against a saturated field. The adjacent layout keeps a white ground and gathers the program inside a pale block.',
      },
      {
        eyebrow: 'Trade-off',
        heading: 'Expression versus ease',
        body: 'Rotated text and multiple emphasis styles give the spread energy, but ask readers to switch direction and interpret more competing signals.',
      },
    ],
  },
  identity: {
    title: 'A voice that carries across the publication.',
    intro:
      'Black, warm paper and burgundy form the recurring palette. Large serif titles and pale oversized numerals create a recognizable visual rhythm.',
    cover: book2Pages[0],
    coverSpread: book2Pages[1],
    discography: book2Pages[8],
    note: {
      eyebrow: 'Identity',
      heading: 'Recurring elements, varied layouts',
      body: 'The cover establishes the title treatment and red rule. Interior pages repeat those cues while changing density, image placement and orientation.',
    },
    swatches: [
      { name: 'Ink', hex: '#141414' },
      { name: 'Warm paper', hex: '#F4F1E9' },
      { name: 'Burgundy', hex: '#7D1C24' },
    ],
    swatchNote: 'Sampled from the ONE-X cover.',
    typefaces: ['Didot', 'Bodoni 72', 'Minion Pro'],
    elements: [
      'A tall serif title with a burgundy second word or letter',
      'Fine burgundy rules as markers and dividers',
      'Pale oversized page numerals',
      'Small capital section labels',
    ],
  },
  members: {
    title: 'The name becomes the anchor.',
    intro: 'A horizontal name treatment and a vertical one create contrasting entry points on facing pages.',
    spread: book2Pages[3],
    detail: detail(
      'b2-adam-detail',
      { md: [1200, 1196], lg: [1600, 1595] },
      'Close-up of page 05: a pale oversized 05 beside the member text column, above a portrait overlaid with the name “Adam Gontier” in heavy serif capitals, “Gontier” in burgundy.',
    ),
    detailCaption: 'Detail, page 05. The name overlaps the portrait, below a pale numeral and a compact text column.',
    principles: [
      { heading: 'Scale', body: 'Names dominate before body copy.' },
      { heading: 'Repetition', body: 'Rules and large numerals link the pages.' },
      { heading: 'Balance', body: 'Portraits offset compact text columns.' },
    ],
    secondSpread: book2Pages[4],
    secondDetail: detail(
      'b2-brad-detail',
      { md: [1200, 842], lg: [1600, 1122] },
      'Close-up of page 07: a shaded italic numeral 07 beside the name “Brad Walst”, “Walst” in burgundy, above a burgundy rule, the opening body copy and the pull words “foundation, movement, and pressure”.',
    ),
    secondDetailCaption: 'Detail, page 07. A shaded italic numeral takes the place of the pale one, while the name keeps its weight.',
  },
  rhythm: {
    title: 'Build rhythm through contrast.',
    lead: book2Pages[5],
    supporting: [
      {
        figure: singlePage(
          'b2-sound',
          'ONE-X page 04: a stacked “The Sound of Three Days Grace” title with three lines in burgundy, a pale oversized 04 and two narrow text columns.',
        ),
        caption: 'Page 04. A stacked title and a narrow text column.',
      },
      {
        figure: detail(
          'b2-pain-detail',
          { md: [1200, 899], lg: [1600, 1199] },
          'Close-up of page 13: “Pain” in large burgundy capitals with a pale 13, the line “From One-X, 2006” and a burgundy rule with a diamond above a centered lyric excerpt.',
        ),
        caption: 'Detail, page 13. One word carries the page.',
      },
      {
        figure: singlePage(
          'b2-five-voices',
          'ONE-X page 10: “The Five Voices” with “Five” in burgundy, a pale oversized 10, and a numbered list of the five members with their roles.',
        ),
        caption: 'Page 10. The member section closes as a list.',
      },
    ],
    notes: [
      {
        eyebrow: 'Composition',
        heading: 'Variation within the system',
        body: 'Member spreads alternate image position, title placement and the density of text. Burgundy accents and serif typography keep those changes connected.',
      },
      {
        eyebrow: 'Reading experience',
        heading: 'Give the eye a reset',
        body: 'Large numerals, white space and short accent passages interrupt denser columns. Their visual role is to create a pause and a new point of entry.',
      },
      {
        eyebrow: 'Hierarchy',
        heading: 'Separate levels of information',
        body: 'A large title, restrained section label and smaller body copy establish distinct roles. Rules add structure without enclosing every element in a box.',
      },
      {
        eyebrow: 'Consistency',
        heading: 'Repeat the visual vocabulary',
        body: 'Pale numbers, burgundy markers and serif headlines recur across different page types. A recognizable system allows the composition to change.',
      },
    ],
  },
  reflection: {
    title: 'A system should hold together. A page should still surprise.',
    notes: [
      {
        eyebrow: 'What the work shows',
        heading: 'Hierarchy is more than size',
        body: 'Position, alignment, grouping, orientation and empty space all change which information is encountered first. The lecture studies make those choices directly comparable.',
      },
      {
        eyebrow: 'What the work shows',
        heading: 'Consistency permits variation',
        body: 'ONE-X has a stronger shared identity because its palette and recurring typographic elements persist even when a spread changes direction or density.',
      },
    ],
    refinements: [
      'Strengthen portrait contrast.',
      'Simplify the outlined name treatments.',
      'Check body copy at its intended print size.',
      'Compare reading order with readers before claiming a readability improvement.',
    ],
  },
  books: [
    {
      id: 'book-1',
      title: 'Book 1 — Typography explorations',
      description:
        'The Sekisui House Kuma Lab Lecture Series, in three parts. A single cover page, then twelve two-page spreads.',
      pages: book1Pages,
    },
    {
      id: 'book-2',
      title: 'Book 2 — ONE-X editorial study',
      description:
        'A typography study of Three Days Grace. A single cover page, then eight two-page spreads running from the cover to the discography on printed page 15.',
      pages: book2Pages,
    },
  ],
  pageCountNote:
    'Counts refer to pages in each PDF. Most PDF pages are two-page spreads, so they do not match the printed page numbers.',
  downloads: [
    pdf('typography-systems-case-study.pdf', 'Download the case study', '374 KB', 'Nine-page presentation, PDF'),
    pdf('book-1-typography.pdf', 'Download Book 1', '543 KB', 'Typography explorations, 13 PDF pages'),
    pdf('book-2-one-x.pdf', 'Download Book 2', '13.8 MB', 'ONE-X editorial study, 9 PDF pages'),
  ],
}
