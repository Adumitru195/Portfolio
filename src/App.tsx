import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Work from '@/sections/Work'
import About from '@/sections/About'
import Contact from '@/sections/Contact'
import CaseStudy from '@/pages/CaseStudy'

function Home() {
  const location = useLocation()

  // Pages can link back to a home section, e.g. "Back to Work".
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!target) return
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
        <About />
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
        <Route path="/project/:id" element={<CaseStudy />} />
      </Routes>
    </HashRouter>
  )
}
