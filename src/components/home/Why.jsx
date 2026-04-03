import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Why = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const testimonials = [
    {
      text: '"Craftech delivered our apartment interiors beyond our expectations. The attention to detail — especially the false ceiling and modular kitchen — was exceptional."',
      author: 'Dr. Waqar Ansari',
      role: 'Residential Interior Fit Out — Mumbai',
      avatar: 'W'
    },
    {
      text: '"Their quantity survey and cost consultancy saved us significantly. The transparency and timeline adherence were excellent. Precise structural management."',
      author: 'Ramzan Shaikh',
      role: 'Building Construction & PMC',
      avatar: 'R'
    },
    {
      text: '"The MEP execution was handled with absolute precision and coordination. High-quality structural work without any legacy rework."',
      author: 'DB Bhavan Developer',
      role: 'Commercial Corporate Project',
      avatar: 'D'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const features = [
    { icon: 'fa-arrows-spin', title: 'Unified Stewardship', desc: 'One point of contact from conceptual design to final key-handover — ensuring zero project coordination gaps.' },
    { icon: 'fa-file-invoice-dollar', title: 'Fiscal Transparency', desc: 'Accurate BOQs and real-time budgetary tracking neutralized financial overruns throughout the project lifecycle.' },
    { icon: 'fa-gear', title: 'MEP Engineering Mastery', desc: 'Code-compliant installation of mechanical, electrical & plumbing systems by our industry-certified experts.' },
    { icon: 'fa-user-tie', title: 'Consultancy Excellence', desc: 'A core team of 10+ dedicated engineers and consultants possessing cross-vertical industry expertise.' },
    { icon: 'fa-calendar-check', title: 'Timeline Resilience', desc: 'We plan for technical risks early — ensuring project completion schedules are met with surgical precision.' },
    { icon: 'fa-handshake', title: 'Partnership Integrity', desc: 'Built on outcomes that exceed expectations through honest communication and results-driven contracting.' },
  ];

  return (
    <section id="why" className="py-24 lg:py-40 bg-white relative overflow-hidden">
      
      {/* Background Technical Watermark */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-gray-50/70 select-none pointer-events-none leading-none tracking-tighter z-0 uppercase hidden lg:block">
        Legacy.
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-16 lg:gap-24">
          
          {/* STRATEGIC ADVANTAGES (Left) */}
          <div className="xl:col-span-7">
             <div className="flex items-center gap-4 mb-8" data-aos="fade-right">
                <span className="w-12 h-[2px] bg-accent" />
                <span className="text-[0.7rem] font-black uppercase tracking-[6px] text-blue/40">The Engineering Distinction</span>
             </div>
             
             <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-black text-blue leading-none tracking-tighter mb-16" data-aos="fade-right">
                Why Stakeholders <br /> <span className="text-accent italic font-black">Choose Craftech.</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
                {features.map((f, i) => (
                  <div key={i} className="group flex flex-col items-start" data-aos="fade-up" data-aos-delay={i * 80}>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-light rounded-3xl flex items-center justify-center text-blue text-xl lg:text-2xl mb-6 lg:mb-8 group-hover:bg-blue group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                        <i className={`fa-solid ${f.icon}`} />
                     </div>
                     <h4 className="text-lg lg:text-xl font-bold text-blue mb-3 group-hover:text-accent transition-colors duration-500">{f.title}</h4>
                     <p className="text-[0.9rem] lg:text-[0.95rem] text-mid leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">{f.desc}</p>
                  </div>
                ))}
              </div>
          </div>

          {/* DYNAMIC TESTIMONIAL DOSSIER (Right) */}
          <div className="xl:col-span-5 h-full flex" data-aos="fade-left">
            <div className="lg:sticky lg:top-40 w-full bg-light border border-gray-100 rounded-[32px] lg:rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[500px] lg:min-h-[600px] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
              
              {/* Decorative */}
              <i className="fa-solid fa-quote-right absolute top-6 right-6 lg:top-10 lg:right-10 text-[6rem] lg:text-[10rem] text-gray-200/40 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />

              {/* TOP CONTENT */}
              <div className="relative z-10 flex flex-col flex-grow">
                {/* Stars */}
                <div className="flex gap-1.5 text-accent mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i key={s} className="fa-solid fa-star text-sm" />
                  ))}
                </div>

                {/* TEXT AREA */}
                <div className="flex items-center flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.6 }}
                      className="w-full"
                    >
                      <p className="text-[clamp(1.2rem,2.3vw,1.8rem)] font-black italic text-blue leading-[1.4] tracking-tight">
                        {testimonials[activeTestimonial].text}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* BOTTOM CONTENT */}
              <div className="relative z-10 mt-10">
                <div className="flex items-center gap-4 lg:gap-6">
                  <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-blue text-white flex items-center justify-center text-2xl lg:text-3xl font-black shadow-xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h5 className="font-black text-blue text-lg lg:text-2xl leading-none mb-1">
                      {testimonials[activeTestimonial].author}
                    </h5>
                    <span className="text-[0.6rem] lg:text-[0.7rem] font-bold text-mid uppercase tracking-[3px] lg:tracking-[4px]">
                      {testimonials[activeTestimonial].role}
                    </span>
                  </div>
                </div>

                {/* SELECTORS */}
                <div className="flex gap-4 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-[4px] rounded-full transition-all duration-500 ${
                        i === activeTestimonial ? "w-12 lg:w-16 bg-accent" : "w-4 lg:w-6 bg-gray-200 hover:bg-mid/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;
