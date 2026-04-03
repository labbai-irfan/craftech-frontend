import React, { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Common Components
import Preloader from './components/common/Preloader'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import CustomCursor from './components/common/CustomCursor'
import ScrollProgress from './components/common/ScrollProgress'
import NoiseOverlay from './components/common/NoiseOverlay'
import WhatsAppButton from './components/common/WhatsAppButton'

// Home Sections
import Hero from './components/home/Hero'
import About from './components/home/About'
import Stats from './components/home/Stats'
import Values from './components/home/Values'
import Services from './components/home/Services'
import Process from './components/home/Process'
import Portfolio from './components/home/Portfolio'
import Videos from './components/home/Videos'
import Why from './components/home/Why'
import ClientsMarquee from './components/home/ClientsMarquee'
import Contact from './components/home/Contact'

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="relative font-poppins selection:bg-blue selection:text-white">
      <Preloader onFinish={() => setLoading(false)} />
      <NoiseOverlay />
      <WhatsAppButton />
      <CustomCursor />
      <ScrollProgress />

      {!loading && (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Stats />
            <Values />
            <Services />
            <Process />
            <Portfolio />
            <Videos />
            <Why />
            <ClientsMarquee />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
