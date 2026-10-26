import { HashRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import Work from '@/sections/Work'
import Contact from '@/sections/Contact'
import CaseStudy from '@/pages/CaseStudy'
import AboutPage from '@/pages/AboutPage'
import ScrollManager from '@/components/ScrollManager'
import { useUserReduceMotion } from '@/hooks/useReducedMotionPreference'

// Where the homepage starts (top, a section, or a restored position) is
// decided by ScrollManager.
function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  // The footer's "Reduce motion" toggle: Framer Motion then skips transform
  // animations everywhere, keeping only opacity fades.
  const reduceMotion = useUserReduceMotion()
  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'never'}>
      <HashRouter>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/project/:id" element={<CaseStudy />} />
        </Routes>
      </HashRouter>
    </MotionConfig>
  )
}
