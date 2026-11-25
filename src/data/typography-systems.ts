import type { PrintPage, TypographySystemsPresentation, ViewerItem } from '@/types/typography'

const base = '/Portfolio/projects/typography-systems'

// Rendered by scripts/typography-systems-assets.py from the original PDFs, which
// are kept privately outside the repository. Only artwork without member
// portraits, interview quotations or song lyrics is published; ONE-X pages that
// carry them appear only as labelled crops. Every page exists at three heights
// (560 / 1100 / 2200 px); spreads are twice as wide as single pages and also
// exist as two printed pages (-l / -r) for narrow screens.
const WIDTHS = {
  single: { sm: 408, md: 800, lg: 1600 },
  spread: { sm: 815, md: 1600, lg: 3200 },
}

type Book = 'book-1' | 'book-2'
const TOTAL: Record<Book, number> = { 'book-1': 13, 'book-2': 9 }

interface SingleSpec {
  kind: 'single'
  title: string
  alt: string
}

interface SpreadSpec {
  kind: 'spread'
  title: string
  alt: string
  /** Alt text for each printed page when the spread is split; omit to keep the spread whole everywhere. */
  pages?: [string, string]
}

function page(book: Book, n: number, spec: SingleSpec | SpreadSpec): PrintPage {
  const id = `p${String(n).padStart(2, '0')}`
  const w = WIDTHS[spec.kind]
  const position = `PDF page ${n} of ${TOTAL[book]}`
  const half = (side: 'l' | 'r', alt: string): ViewerItem => ({
    src: `${base}/${book}/${id}-${side}-md.webp`,
    width: 800,
    height: 1100,
    large: `${base}/${book}/${id}-${side}-lg.webp`,
    largeWidth: 1600,
    alt,
    title: `${spec.title}, ${side === 'l' ? 'left' : 'right'}-hand page`,
    label: `${position} · ${side === 'l' ? 'left' : 'right'}-hand page`,
  })
  return {
    id: `${book}-${id}`,
    kind: spec.kind,
    title: spec.title,
    alt: spec.alt,
    label: `${position} · ${spec.kind === 'single' ? 'Single page' : 'Two-page spread'}`,
    small: `${base}/${book}/${id}-sm.webp`,
    smallWidth: w.sm,
    src: `${base}/${book}/${id}-md.webp`,
    width: w.md,
    height: 1100,
    large: `${base}/${book}/${id}-lg.webp`,
    largeWidth: w.lg,
    halves: spec.kind === 'spread' && spec.pages ? [half('l', spec.pages[0]), half('r', spec.pages[1])] : undefined,
  }
}

/** One printed page cut from a ONE-X spread that is not published whole. */
function printedPage(name: string, title: string, label: string, alt: string, adaptation: string): PrintPage {
  return {
    id: name,
    kind: 'single',
    title,
    label,
    alt,
    adaptation,
    small: `${base}/details/${name}-sm.webp`,
    smallWidth: 408,
    src: `${base}/details/${name}-md.webp`,
    width: 800,
    height: 1100,
    large: `${base}/details/${name}-lg.webp`,
    largeWidth: 1600,
  }
}

/** The top of a ONE-X page, cut above material that is not published. */
function crop(
  name: string,
  size: { sm: [number, number]; md: [number, number]; lg: number },
  title: string,
  label: string,
  alt: string,
  adaptation: string,
): PrintPage {
  return {
    id: name,
    kind: 'crop',
    title,
    label,
    alt,
    adaptation,
    small: `${base}/details/${name}-sm.webp`,
    smallWidth: size.sm[0],
    src: `${base}/details/${name}-md.webp`,
    width: size.md[0],
    height: size.md[1],
    large: `${base}/details/${name}-lg.webp`,
    largeWidth: size.lg,
  }
}

/** One printed page of a published spread, shown on its own. */
function printedHalf(spread: PrintPage, side: 0 | 1, book: string): PrintPage {
  const half = spread.halves?.[side]
  if (!half) throw new Error(`${spread.id} has no printed pages`)
  return {
    ...half,
    id: `${spread.id}-${side === 0 ? 'left' : 'right'}`,
    kind: 'single',
    title: half.title ?? spread.title,
    label: `${book} · ${half.label ?? spread.label}`,
    small: half.src,
    smallWidth: half.width,
  }
}

/* Book 1 · Typography explorations ------------------------------------- */

const b1Cover = page('book-1', 1, {
  kind: 'single',
  title: 'Cover, part 1',
  alt: 'Book 1 cover: a small course credit block at the top and an oversized “Book 1” with “part 1” set low on a white page.',
})
const b1Aligned = page('book-1', 2, {
  kind: 'spread',
  title: 'Two aligned compositions',
  alt: 'Two-page spread of the lecture series announcement, each page with a horizontal title, an aligned description and a stacked list of lectures.',
  pages: [
    'Lecture series announcement with a horizontal two-line title, an aligned description and a stacked list of five lectures, read top to bottom.',
    'A second aligned version of the announcement, with the title, description and lecture list kept in one reading column.',
  ],
})
const b1Rotated = page('book-1', 3, {
  kind: 'spread',
  title: 'Rotated program',
  alt: 'Two-page spread: on the left an aligned layout with a dropped initial; on the right the description and lecture list rotated to run vertically beneath a horizontal title.',
  pages: [
    'Aligned announcement layout that opens with a dropped initial.',
    'The description and lecture list rotated ninety degrees to run vertically beneath a horizontal title.',
  ],
})
const b1Diagonal = page('book-1', 4, {
  kind: 'spread',
  title: 'Diagonal and vertical type',
  alt: 'Two-page spread with the department name set vertically along the left edge, the description set on a diagonal, and lecture dates rotated in columns on the right page.',
  pages: [
    'The department name set vertically along the left edge, the series title and lectures across the top, and the description set on a diagonal.',
    'A horizontal title and right-aligned description, with the lecture names and dates rotated into vertical columns.',
  ],
})
const b1Groups = page('book-1', 5, {
  kind: 'spread',
  title: 'Separated groups',
  alt: 'Two-page spread: a stacked one-word-per-line title on the left page, and on the right the lecture list, description and title pulled apart into separate groups.',
  pages: [
    'The series title stacked one word per line.',
    'The lecture list at the top, the description in the middle, the series title below it and the department name at the bottom left, each group separated by open space.',
  ],
})
const b1Ruled = page('book-1', 6, {
  kind: 'spread',
  title: 'Ruled columns',
  alt: 'Two-page spread in which heavy horizontal rules divide the description and lecture listings into columns.',
  pages: [
    'Left-hand page of the ruled composition: heavy horizontal rules divide the description into columns.',
    'Right-hand page of the ruled composition: the lecture listings sit between heavy horizontal rules.',
  ],
})
const b1Block = page('book-1', 9, {
  kind: 'spread',
  title: 'Black block and rotated columns',
  alt: 'Two-page spread: a solid black block anchors the left page under a vertical department name; the right page sets the program in rotated columns.',
  pages: [
    'A solid black block anchors the page beneath a vertical department name.',
    'The lecture program set in rotated columns.',
  ],
})
const b1Blue = page('book-1', 11, {
  kind: 'spread',
  title: 'Blue field and pink block',
  alt: 'Two-page spread: a saturated blue page with light and yellow type and a vertical lecture list, beside a white page that gathers the program inside a pale pink block.',
  pages: [
    'A saturated blue page with light and yellow type and a vertical lecture list.',
    'A white page that gathers the program inside a pale pink block.',
  ],
})
const b1Bands = page('book-1', 12, {
  kind: 'spread',
  title: 'Pale green bands',
  alt: 'Two-page spread: small rotated text on the left page; on the right, lectures set in pale green bands beside a large vertical department name.',
  pages: [
    'Small rotated text on an open white page.',
    'Lectures set in pale green bands beside a large vertical department name.',
  ],
})
const b1Triangle = page('book-1', 13, {
  kind: 'spread',
  title: 'Triangle and rotated list',
  alt: 'Two-page spread: a pale green panel and triangle frame the program on the left; the right page stacks the department name and sets the lecture list rotated.',
  pages: [
    'A pale green panel and a triangle frame the program.',
    'The department name stacked, with the lecture list rotated.',
  ],
})

/* Book 2 · ONE-X -------------------------------------------------------- */

const b2Cover = page('book-2', 1, {
  kind: 'single',
  title: 'Front cover',
  alt: 'ONE-X front cover on warm paper: a tall black and burgundy “ONE-X” title, “A Typography Study of 3 Days Grace”, design and course credits, and a burgundy vertical rule.',
})
const b2CoverSpread = page('book-2', 2, {
  kind: 'spread',
  title: 'Back and front cover',
  alt: 'ONE-X cover spread: a warm paper back cover reading “Every album represents a chapter. Together, they tell the story”, beside the front cover reversed out of black.',
  pages: [
    'ONE-X back cover on warm paper reading “Every album represents a chapter. Together, they tell the story.”',
    'ONE-X front cover reversed out of black, with the title in white and burgundy.',
  ],
})
const b2Intro = page('book-2', 3, {
  kind: 'spread',
  title: 'Introduction · The sound of Three Days Grace (04)',
  alt: 'ONE-X spread: an italic “Introduction” page with body copy on warm paper, beside page 04 with a stacked “The Sound of Three Days Grace” title, a pale oversized 04 and two text columns.',
  pages: [
    'ONE-X introduction page on warm paper: an italic “Introduction” title above three short paragraphs, closing on “Dark, Direct, and Emotionally controlled.”',
    'ONE-X page 04: a stacked “The Sound of Three Days Grace” title with “Three” in burgundy, a pale oversized 04 and a narrow text column inside a grey frame.',
  ],
})
const b2Discography = page('book-2', 9, {
  kind: 'spread',
  title: 'Discography (15)',
  alt: 'ONE-X discography page 15: album years from 2003 to 2022 in burgundy with italic album titles, arranged in two columns around a vertical rule. The facing page is blank.',
})

const b2Brad = crop(
  'b2-brad-detail',
  { sm: [600, 421], md: [1200, 842], lg: 1600 },
  'Brad Walst (07), top of the page',
  'PDF page 5 of 9 · printed page 07, cropped',
  'Top of ONE-X page 07: a shaded italic numeral 07 beside the name “Brad Walst” in heavy serif capitals, “Walst” outlined in burgundy, above a burgundy rule, the opening body copy and the burgundy words “foundation, movement, and pressure”.',
  'Cropped. The member portrait lower on the page is not shown.',
)
const b2Matt = crop(
  'b2-matt-detail',
  { sm: [600, 569], md: [1200, 1139], lg: 1600 },
  'Matt Walst (09), top of the page',
  'PDF page 6 of 9 · printed page 09, cropped',
  'Top of ONE-X page 09: “Member 05” in burgundy over a rule, a pale oversized 09, and the name “Matt Walst” set vertically in two tall lines, “Walst” in burgundy, beside a ruled column of body copy.',
  'Cropped. The member portrait and quotation lower on the page are not shown.',
)
const b2FiveVoices = printedPage(
  'b2-five-voices',
  'The five voices (10)',
  'PDF page 6 of 9 · printed page 10',
  'ONE-X page 10: “The Five Voices” with “Five” in burgundy, a pale oversized 10, and a numbered list of the five members with their roles.',
  'Right-hand page only. The facing page 09 appears above as a crop.',
)
const b2LyricTitles = crop(
  'b2-lyric-titles',
  { sm: [600, 243], md: [1200, 485], lg: 1600 },
  'Song titles (11–12)',
  'PDF page 7 of 9 · printed pages 11–12, cropped',
  'Top of ONE-X pages 11 and 12 on warm paper: the titles “I Hate Everything About You” and “Animal I Have Become” set large in black with burgundy last lines, pale numerals 11 and 12, the album and year, and a one-line description of each song.',
  'Cropped. The lyric excerpts below the titles are not shown.',
)
const b2Pain = crop(
  'b2-pain-title',
  { sm: [600, 342], md: [1200, 685], lg: 1600 },
  'Pain (13), title only',
  'PDF page 8 of 9 · printed page 13, cropped',
  'Top of ONE-X page 13 on warm paper: “Pain” in large burgundy capitals beside a pale 13, “From One-X, 2006” and a two-line description.',
  'Cropped. The lyric excerpt below the title is not shown.',
)
const b2Albums = printedPage(
  'b2-albums',
  'The albums (14)',
  'PDF page 8 of 9 · printed page 14',
  'ONE-X page 14: “The Albums” in large serif capitals, “Albums” in burgundy, a pale 14, the line “A timeline of the band’s recorded work.” and a thick burgundy rule.',
  'Right-hand page only. The facing lyric page is not shown.',
)

export const typographySystems: TypographySystemsPresentation = {
  opening: {
    eyebrow: 'Academic typography studies',
    title: 'Type sets the tone.',
    lede: 'Two print studies in hierarchy, composition and editorial rhythm.',
    meta: [
      { label: 'Course', value: 'GD 232 Typography: Systems' },
      { label: 'School', value: 'DePaul University' },
      { label: 'Term', value: 'Spring 2026' },
      { label: 'Format', value: 'Two print books, 16 × 11 in spreads' },
      { label: 'Design', value: 'Andrew Dumitru, credited on both covers' },
    ],
    notice:
      'Coursework. ONE-X is a student typography study of Three Days Grace. It is not affiliated with or endorsed by the band, its members or its labels.',
    cover: b2Cover,
  },
  publications: {
    title: 'One discipline. Two ways to explore it.',
    intro:
      'Two related studies, not two versions of one project. The first holds its content fixed and varies the typography; the second builds one consistent voice for a publication. Both ask how type can set a clear reading order while giving each composition its own character.',
    studies: [
      {
        number: 'Study 01',
        name: 'Book 1 · Typography explorations',
        heading: 'Hierarchy through variation',
        body: 'Twelve spreads set the same lecture series announcement again and again, changing only scale, alignment, orientation, grouping and color.',
        image: b1Block,
      },
      {
        number: 'Study 02',
        name: 'Book 2 · ONE-X',
        heading: 'An editorial identity',
        body: 'A music publication about Three Days Grace, with member profiles, song spreads and an album timeline held together by one palette and type system.',
        image: b2Intro,
      },
    ],
    walkthrough: {
      eyebrow: 'Publication walkthrough',
      title: 'Both books, page by page.',
      body: 'A paced look through spreads from both books, then two close views where the type can be read.',
      descriptionSummary: 'What the walkthrough shows',
      video: {
        mp4: `${base}/walkthrough.mp4`,
        poster: {
          src: `${base}/walkthrough-poster.webp`,
          alt: 'Book 1 spread with the department name set vertically and the description on a diagonal, the poster for the publication walkthrough',
          width: 1600,
          height: 1000,
        },
        label: 'publication walkthrough',
        duration: 37,
        caption:
          'Publication walkthrough built from the original book PDFs, about 37 seconds, with no audio. Pages with member portraits or song lyrics appear only as labelled crops.',
        description:
          'The walkthrough shows full compositions first. From Book 1, the Sekisui House Kuma Lab lecture series: the cover, the spread of two aligned compositions, the spread with diagonal and vertical type, and the blue-field spread with its pink block. From ONE-X: the front cover; the introduction beside The Sound of Three Days Grace; the tops of printed pages 07 and 09 with the names Brad Walst and Matt Walst, cropped above the member portraits; page 10, The Five Voices; the song titles from pages 11 and 12, cropped above the lyrics; and the discography. It closes with two readable detail views: Book 1’s diagonal description beside its vertical department name, and The Five Voices title with its numbered list of members and roles. Pages change with gentle crossfades, with no pans or zooms.',
      },
    },
  },
  hierarchy: {
    title: 'Same content. Different reading paths.',
    intro:
      'Every page in Book 1 carries the same announcement for the Sekisui House Kuma Lab Lecture Series: the department, the series title, a description, five lectures with dates, and the venue.',
    contentNote: {
      eyebrow: 'Brief',
      heading: 'The words were given. The typography was the work.',
      body: 'The announcement text was supplied by the course instructor. With the content held constant, each layout could test hierarchy, alignment, scale, orientation and composition on its own, and the differences in reading order stay easy to compare.',
    },
    pages: [
      {
        lever: 'Alignment',
        note: 'A horizontal title and aligned text set a predictable top-to-bottom sequence.',
        page: printedHalf(b1Aligned, 0, 'Book 1'),
      },
      {
        lever: 'Orientation',
        note: 'Rotated information adds a second reading direction and a more active page.',
        page: printedHalf(b1Rotated, 1, 'Book 1'),
      },
      {
        lever: 'Grouping',
        note: 'Open space separates the title, program and details into their own positions.',
        page: printedHalf(b1Groups, 1, 'Book 1'),
      },
    ],
    spreads: [
      {
        lever: 'Scale',
        note: 'An oversized vertical department name takes the lead; the lectures become a secondary layer.',
        page: b1Bands,
      },
      {
        lever: 'Color',
        note: 'A saturated blue field and a pale pink block create two different centers of attention on facing pages.',
        page: b1Blue,
      },
    ],
    typefaceNote:
      'Book 1’s PDF embeds a wider range of faces than ONE-X, including Avenir, Serifa, Proxima Nova, Roboto Condensed, Didot, Bodoni 72 and Minion Pro.',
  },
  identity: {
    title: 'A voice that carries across the publication.',
    intro:
      'ONE-X turns from variation to consistency. Black, warm paper and burgundy form the palette, and tall high-contrast serifs carry every title.',
    coverSpread: b2CoverSpread,
    coverSpreadCaption: 'Back and front cover as a spread, with the front reversed out of black.',
    swatches: [
      { name: 'Ink', hex: '#141414' },
      { name: 'Warm paper', hex: '#F4F1E9' },
      { name: 'Burgundy', hex: '#7D1C24' },
    ],
    swatchNote: 'Sampled from the rendered ONE-X cover.',
    typefaces: ['Didot', 'Bodoni 72', 'Minion Pro'],
    typefaceNote: 'Embedded in the ONE-X PDF. This page is set in Bodoni Moda as a web stand-in.',
    elements: [
      'A tall serif title with a burgundy second word or letter',
      'Fine burgundy rules as markers and dividers',
      'Pale oversized page numerals',
      'Small capital section labels',
    ],
  },
  rhythm: {
    title: 'The system repeats. The page still moves.',
    intro:
      'Member profiles, song pages and the album timeline each take a different shape, while the same numerals, rules and serif titles return on every page.',
    names: [b2Brad, b2Matt],
    namesNote:
      'The member name is the anchor of each profile. Page 07 sets it horizontally beside a shaded italic numeral; page 09 turns it vertical beside a pale one. Pages that carry member portraits or quotations are shown only from the top, above that material.',
    sequence: [
      { page: b2FiveVoices, caption: 'Page 10. The member section closes as a numbered list.' },
      { page: b2Pain, caption: 'Page 13. One word carries the page.' },
      { page: b2Albums, caption: 'Page 14. A new part opens with the same title treatment.' },
    ],
    notes: [
      {
        eyebrow: 'Composition',
        heading: 'Variation within the system',
        body: 'Pages alternate the orientation of the title, the position of the numeral and the density of text. Burgundy accents and serif type keep those changes connected.',
      },
      {
        eyebrow: 'Consistency',
        heading: 'Repeat the visual vocabulary',
        body: 'Pale numbers, burgundy markers and serif headlines recur across member, song and timeline pages, so a layout can change without the book losing its voice.',
      },
    ],
  },
  reflection: {
    title: 'A system should hold together. A page should still surprise.',
    analysisNote:
      'Retrospective visual analysis, written from the finished pages after the course. It describes what the artwork shows, not the original design process, which was not documented at the time.',
    notes: [
      {
        eyebrow: 'What the work shows',
        heading: 'Hierarchy is more than size',
        body: 'Position, alignment, grouping, orientation and empty space all change which information is met first. Fixed content makes those choices directly comparable.',
      },
      {
        eyebrow: 'What the work shows',
        heading: 'Consistency permits variation',
        body: 'ONE-X holds together because its palette and recurring typographic elements persist when a page changes direction or density.',
      },
      {
        eyebrow: 'Trade-off',
        heading: 'Expression versus ease',
        body: 'Rotated text and several emphasis styles give Book 1’s later spreads energy, but ask the reader to switch direction and weigh more competing signals.',
      },
      {
        eyebrow: 'Trade-off',
        heading: 'Character versus clarity',
        body: 'Outlined names and pale numerals strengthen the ONE-X identity, but thin outlines and low-contrast figures read less clearly at small sizes.',
      },
    ],
    refinements: [
      'Simplify the outlined name treatments.',
      'Check body copy at its intended print size.',
      'Record image, quotation and lyric sources alongside the layout files.',
      'Compare reading order with readers before claiming a readability improvement.',
    ],
  },
  selection: {
    title: 'Selected pages',
    intro:
      'A selection from both books for closer browsing. Select a page to enlarge it. Counts refer to pages in each PDF; most PDF pages are two-page spreads.',
    toggle: 'Browse selected pages from both books',
    phoneNote: 'On a phone, spreads open one printed page at a time.',
    books: [
      {
        id: 'book-1',
        title: 'Book 1 — Typography explorations',
        description: 'Ten of the thirteen PDF pages: the cover and nine spreads. The part dividers are left out.',
        pages: [b1Cover, b1Aligned, b1Rotated, b1Diagonal, b1Groups, b1Ruled, b1Block, b1Blue, b1Bands, b1Triangle],
      },
      {
        id: 'book-2',
        title: 'Book 2 — ONE-X editorial study',
        description:
          'Pages without member portraits or song lyrics, plus labelled crops from the tops of pages that have them.',
        pages: [b2Cover, b2CoverSpread, b2Intro, b2Brad, b2Matt, b2FiveVoices, b2LyricTitles, b2Pain, b2Albums, b2Discography],
      },
    ],
  },
  sources: {
    title: 'About the artwork shown',
    items: [
      'Book 1 sets announcement text supplied by the course instructor for the assignment. The University of Tokyo, Sekisui House and the named lecturers are not affiliated with this work.',
      'ONE-X includes member photographs, quotations from interviews and song lyrics. Those passages are not reproduced here; crops that leave them out are labelled.',
      'Band, member, album and song names are used for editorial context only.',
    ],
  },
}
