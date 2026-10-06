import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Work from '@/sections/Work'
import Contact from '@/sections/Contact'
import CaseStudy from '@/pages/CaseStudy'
import AboutPage from '@/pages/AboutPage'

function Home() {
  const location = useLocation()

  // Pages can link back to a home section, e.g. "Back to Work".
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    // Arriving from another page without a target starts at the top.
    if (!target) {
      window.scrollTo(0, 0)
      return
    }
    const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [location])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/project/:id" element={<CaseStudy />} />
      </Routes>
    </HashRouter>
  )
}
