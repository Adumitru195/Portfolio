import { Suspense, lazy } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import Work from '@/sections/Work'
import AboutPreview from '@/sections/AboutPreview'
import Contact from '@/sections/Contact'
import ScrollManager from '@/components/ScrollManager'
import { useUserReduceMotion } from '@/hooks/useReducedMotionPreference'

// Other routes load on demand, so the homepage doesn't download them. Once
// loaded they stay cached, so Back/Forward renders them synchronously and
// ScrollManager can restore the position.
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const CaseStudy = lazy(() => import('@/pages/CaseStudy'))

// Where the homepage starts (top, a section, or a restored position) is
// decided by ScrollManager.
function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Services />
        <Work />
        <AboutPreview />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  // Reduced motion for the whole site: the footer's "Reduce motion" toggle
  // forces it ('always'); otherwise the system setting decides ('user').
  // Framer Motion then skips transform animations, keeping only opacity
  // fades. Pages must not add their own MotionConfig: it would override this.
  const reduceMotion = useUserReduceMotion()
  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      <HashRouter>
        <ScrollManager />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/project/:id" element={<CaseStudy />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </MotionConfig>
  )
}
