import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';
import { cmsApi } from '../../services/api';

const Why = () => {
  const { whyFeatures } = useCMS();
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await cmsApi.getTestimonials();
        if (data.success) setTestimonials(data.data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  const features = whyFeatures.length > 0 ? whyFeatures : [
    { icon: 'fa-arrows-spin', title: 'Unified Stewardship', description: 'One point of contact from conceptual design to final key-handover.' },
    { icon: 'fa-file-invoice-dollar', title: 'Fiscal Transparency', description: 'Accurate BOQs and real-time budgetary tracking neutralized overruns.' },
    { icon: 'fa-gear', title: 'MEP Engineering Mastery', description: 'Code-compliant installation of mechanical, electrical & plumbing systems.' },
  ];

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  return (
    <section id="why" className="py-24 lg:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-gray-50/70 select-none pointer-events-none leading-none tracking-tighter z-0 uppercase hidden lg:block">
        Legacy.
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-16 lg:gap-24">
          
          <div className="xl:col-span-7">
             <div className="flex items-center gap-4 mb-8" data-aos="fade-right">
                <span className="w-12 h-[2px] bg-accent" />
                <span className="text-[0.7rem] font-black uppercase tracking-[6px] text-navy/40">The Engineering Distinction</span>
             </div>
             
             <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-black text-navy leading-none tracking-tighter mb-16" data-aos="fade-right">
                Why Stakeholders <br /> <span className="text-accent italic font-black">Choose Craftech.</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-12">
                {features.map((f, i) => (
                  <div key={i} className="group flex flex-col items-start" data-aos="fade-up" data-aos-delay={i * 80}>
                     <div className="w-14 h-14 lg:w-16 lg:h-16 bg-light rounded-3xl flex items-center justify-center text-navy text-xl lg:text-2xl mb-6 lg:mb-8 group-hover:bg-navy group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                        <i className={`fa-solid ${f.icon}`} />
                     </div>
                     <h4 className="text-lg lg:text-xl font-bold text-navy mb-3 group-hover:text-accent transition-colors duration-500">{f.title}</h4>
                     <p className="text-[0.9rem] lg:text-[0.95rem] text-mid leading-relaxed font-medium opacity-60 group-hover:opacity-100 transition-opacity">{f.description}</p>
                  </div>
                ))}
              </div>
          </div>

          <div className="xl:col-span-5 h-full flex" data-aos="fade-left">
            {testimonials.length > 0 && (
              <div className="lg:sticky lg:top-40 w-full bg-light border border-gray-100 rounded-[32px] lg:rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col justify-between min-h-[500px] lg:min-h-[600px] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
                <i className="fa-solid fa-quote-right absolute top-6 right-6 lg:top-10 lg:right-10 text-[6rem] lg:text-[10rem] text-gray-200/40 pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="flex gap-1.5 text-accent mb-8">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <i key={s} className="fa-solid fa-star text-sm" />
                    ))}
                  </div>

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
                        <p className="text-[clamp(1.2rem,2.3vw,1.8rem)] font-black italic text-navy leading-[1.4] tracking-tight">
                          "{testimonials[activeTestimonial].text}"
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative z-10 mt-10">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-navy text-white flex items-center justify-center text-2xl lg:text-3xl font-black shadow-xl">
                      {testimonials[activeTestimonial].author?.[0] || 'C'}
                    </div>
                    <div>
                      <h5 className="font-black text-navy text-lg lg:text-2xl leading-none mb-1">
                        {testimonials[activeTestimonial].author}
                      </h5>
                      <span className="text-[0.6rem] lg:text-[0.7rem] font-bold text-mid uppercase tracking-[3px] lg:tracking-[4px]">
                        {testimonials[activeTestimonial].role}
                      </span>
                    </div>
                  </div>

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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;
