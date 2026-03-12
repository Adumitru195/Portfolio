import Navbar from '@/components/Navbar'
import ScrollProgress from '@/components/ScrollProgress'
import Footer from '@/components/Footer'
import Hero from '@/sections/Hero'
import Work from '@/sections/Work'
import About from '@/sections/About'
import Contact from '@/sections/Contact'

export default function App() {
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
