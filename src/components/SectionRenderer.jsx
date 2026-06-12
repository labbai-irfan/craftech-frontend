import React from 'react';
import Hero from './home/Hero';
import About from './home/About';
import Stats from './home/Stats';
import Values from './home/Values';
import Services from './home/Services';
import Process from './home/Process';
import Portfolio from './home/Portfolio';
import Videos from './home/Videos';
import Why from './home/Why';
import ClientsMarquee from './home/ClientsMarquee';
import Contact from './home/Contact';

const SECTION_MAP = {
  hero: Hero,
  about: About,
  stats: Stats,
  values: Values,
  services: Services,
  process: Process,
  portfolio: Portfolio,
  videos: Videos,
  why: Why,
  clients: ClientsMarquee,
  contact: Contact,
};

const SectionRenderer = ({ sections }) => {
  if (!sections || sections.length === 0) {
    // Fallback to default order if no section config in DB
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      {sections
        .filter((s) => s.isVisible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((section) => {
          const Component = SECTION_MAP[section.type];
          if (!Component) return null;
          return <Component key={section._id || section.type} data={section.data} />;
        })}
    </>
  );
};

export default SectionRenderer;
