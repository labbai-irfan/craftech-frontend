import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Values = () => {
  const values = [
    {
      icon: 'fa-shield-halved',
      title: 'Integrity & Trust',
      desc: 'Forming bedrock-solid relationships through absolute transparency and ethical contracting practices.',
      color: '#0A2647'
    },
    {
      icon: 'fa-microchip',
      title: 'Precision Engineering',
      desc: 'Utilizing sophisticated technology and lean workflows for flawless project execution from Day 1.',
      color: '#C41B1F'
    },
    {
      icon: 'fa-leaf',
      title: 'Innovation',
      desc: 'Seeking advanced, sustainable ways to engineer safer and smarter futures for our clients.',
      color: '#D4AF37'
    },
    {
      icon: 'fa-award',
      title: 'Total Accountability',
      desc: 'Taking complete ownership of the result — from the first brick laid to the final polished finish.',
      color: '#0A2647'
    },
  ];

  return (
    <section id="values" className="py-40 bg-white relative">
      <div className="container mx-auto px-8 relative z-10">

        {/* Modern Header Layout */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24" data-aos="fade-up">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-1 bg-accent" />
              <span className="text-[0.8rem] font-black uppercase tracking-[5px] text-blue/30">The Foundation</span>
            </div>
            <h2 className="text-[clamp(2.5rem,4.5vw,4rem)] font-black text-blue leading-none tracking-tight">
              Our Core <br /> <span className="text-accent underline decoration-[6px] underline-offset-[12px]">Pillars.</span>
            </h2>
          </div>
          <p className="max-w-[450px] text-[1.1rem] text-mid font-medium mb-4">
            The fundamental ethics that have cemented nuestro position as a trusted partner in Mumbai's elite construction landscape.
          </p>
        </div>

        {/* Feature Grid with Interlocking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:divide-x lg:divide-gray-100 border-y border-gray-100">
          {values.map((val, i) => (
            <div
              key={i}
              className="group p-12 hover:bg-light transition-colors duration-500 cursor-none"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-[3.5rem] font-black text-gray-50 group-hover:text-blue/5 transition-colors mb-8 -mt-4">
                0{i + 1}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-center text-blue text-xl mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue group-hover:text-white">
                <i className={`fa-solid ${val.icon}`} />
              </div>

              <h4 className="text-xl font-extrabold text-blue mb-4 group-hover:translate-x-2 transition-transform duration-500">
                {val.title}
              </h4>
              <p className="text-[0.9rem] text-mid leading-[1.8] group-hover:translate-x-2 transition-transform duration-500 delay-75">
                {val.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Values;
