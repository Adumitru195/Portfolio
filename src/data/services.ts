/** Copy for the homepage "How I can help" section. */

export type ServiceId = 'build' | 'improve' | 'ux'

export interface Service {
  id: ServiceId
  title: string
  body: string
}

export const services = {
  label: 'How I can help',
  items: [
    {
      id: 'build',
      title: 'Website design + build',
      body: 'I design and build responsive websites with clear content, straightforward navigation, and a consistent visual style.',
    },
    {
      id: 'improve',
      title: 'Website improvements',
      body: 'I refine existing websites, focusing on layouts, navigation, and forms that need a clearer direction.',
    },
    {
      id: 'ux',
      title: 'UX/UI design',
      body: 'I turn ideas into user flows, interface designs, and interactive prototypes before development begins.',
    },
  ] satisfies Service[],
}
