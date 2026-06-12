import React, { useEffect, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Common Components
import Preloader from '../components/common/Preloader'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import CustomCursor from '../components/common/CustomCursor'
import ScrollProgress from '../components/common/ScrollProgress'
import NoiseOverlay from '../components/common/NoiseOverlay'
import WhatsAppButton from '../components/common/WhatsAppButton'

import { useCMS } from '../context/CMSContext'
import SectionRenderer from '../components/SectionRenderer'
import SEOHead from '../components/common/SEOHead'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '../utils/seo'

function HomePage() {
  const { homeData, loading: cmsLoading } = useCMS();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
    });
    document.body.classList.add('cursor-hidden');
    return () => document.body.classList.remove('cursor-hidden');
  }, []);

  return (
    <div className="relative font-poppins selection:bg-navy selection:text-white">
      <SEOHead
        page="home"
        schema={generateOrganizationSchema()}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
        path="/"
      />
      <Preloader onFinish={() => setLoading(false)} />
      <NoiseOverlay />
      <WhatsAppButton />
      <CustomCursor />
      <ScrollProgress />

      {(!loading && !cmsLoading) && (
        <>
          <Navbar />
          <main>
            <SectionRenderer sections={homeData?.sections} />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default HomePage
