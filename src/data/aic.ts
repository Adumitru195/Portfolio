import type { SectionTone } from '@/lib/presentationTheme'

// Presentation labels live beside the existing research content in projects.ts.
export const aic = {
  eyebrow: 'Academic group project · Museum engagement',
  title: 'AIC Museum Experience',
  subtitle: 'Making a museum visit feel more active, social and worth returning for.',
  heroCaption: 'Selected screens from our original Figma concept: events, museum navigation and collections.',
  heroScreens: [5, 17, 11],
  meta: [
    { label: 'Role', value: 'UX Researcher / Product Designer' },
    { label: 'Term', value: 'Spring 2026' },
    { label: 'Course', value: 'UXD 260 · DePaul University' },
    { label: 'Platform', value: 'Mobile app concept' },
  ],
  sections: [
    { id: 'overview', title: 'A companion to the visit.', tone: 'base' },
    { id: 'my-contribution', title: 'Where I contributed.', tone: 'alt' },
    { id: 'challenge', title: 'More than a walk through the galleries.', tone: 'base' },
    { id: 'research', title: 'Start with the people visiting.', tone: 'alt' },
    { id: 'key-insights', title: 'What the interviews revealed.', tone: 'accent' },
    { id: 'visitor-journey', title: 'Find the friction before the gallery.', tone: 'base' },
    { id: 'experience-ecosystem', title: 'Connect the visit to what follows.', tone: 'alt' },
    { id: 'design-principles', title: 'A direction for the experience.', tone: 'base' },
    { id: 'concept', title: 'An invitation to take part.', tone: 'alt' },
    { id: 'app-screens', title: 'The mobile companion, screen by screen.', tone: 'base' },
    { id: 'design-choices', title: 'Make the next action visible.', tone: 'alt' },
    { id: 'outcome', title: 'Research translated into a concept.', tone: 'base' },
    { id: 'reflection', title: 'Let the problem guide the technology.', tone: 'accent' },
  ] satisfies { id: string; title: string; tone: SectionTone }[],
  gallery: { expand: 'Explore all 26 screens', collapse: 'Show selected screens', detail: 'Select a screen to enlarge it.' },
}
