import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Work from '@/sections/Work'
import Contact from '@/sections/Contact'
import CaseStudy from '@/pages/CaseStudy'
import AboutPage from '@/pages/AboutPage'
import ScrollManager from '@/components/ScrollManager'

// Where the homepage starts (top, a section, or a restored position) is
// decided by ScrollManager.
function Home() {
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
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/project/:id" element={<CaseStudy />} />
      </Routes>
    </HashRouter>
  )
}
