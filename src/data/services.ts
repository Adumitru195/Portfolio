/** Copy for the homepage "How I can help" section. */

export type ServiceId = 'websites' | 'audits' | 'product'

export interface Service {
  id: ServiceId
  title: string
  body: string
  deliverables: string[]
}

export const services = {
  label: 'How I can help',
  heading: ['Good design.', 'Practical solutions.'],
  intro:
    'Whether you’re starting from scratch or improving something that already exists, I can help you find the right direction.',
  items: [
    {
      id: 'websites',
      title: 'Landing pages & websites',
      body: 'I design and build responsive websites that communicate what you do, make information easy to find, and give visitors a clear next step.',
      deliverables: ['Landing pages', 'Business websites', 'Responsive design'],
    },
    {
      id: 'audits',
      title: 'Website audits & redesigns',
      body: 'I identify usability issues and improve existing websites through clearer layouts, navigation, content structure, and user flows.',
      deliverables: ['UX audits', 'Website redesigns', 'Usability improvements'],
    },
    {
      id: 'product',
      title: 'Digital product & UX/UI design',
      body: 'I turn early ideas into thoughtful interfaces, user flows, and interactive prototypes, helping you explore and refine a product before development begins.',
      deliverables: ['App design', 'Wireframes', 'Figma prototypes'],
    },
  ] satisfies Service[],
}

/**
 * Words printed inside the illustrations. They are drawings of generic
 * interfaces, not client work, so nothing here names a real business.
 */
export const serviceIllustrationText = {
  websites: { headline: ['Fresh bread,', 'baked daily.'], cta: 'Order ahead' },
  audits: { headline: 'Find what you need.', cta: 'Get started' },
  product: { steps: ['Browse', 'Choose', 'Confirm'] },
}
