import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Work from '@/sections/Work'
import About from '@/sections/About'
import Contact from '@/sections/Contact'
import CaseStudy from '@/pages/CaseStudy'

function Home() {
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
