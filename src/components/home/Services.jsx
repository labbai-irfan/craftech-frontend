import React, { useEffect, useState } from 'react';
import { contentApi } from '../../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getServices()
      .then(({ data }) => {
        if (data.success) {
          setServices(data.data.filter(s => s.active !== false));
        }
      })
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !services.length) return null;

  return (
    <section id="services" className="py-24 md:py-40 bg-light relative overflow-hidden">
      {/* Precision Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A2647 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-[800px] mb-12 md:mb-20" data-aos="fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.7rem] font-black uppercase tracking-[5px] text-navy/40">Our Architecture of Service</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-navy leading-[1.1] tracking-tighter">
              Domain <br /> <span className="text-accent italic font-black">Specialization.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div key={service._id} className="group relative p-12 bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden hover:-translate-y-3 cursor-none" data-aos="fade-up" data-aos-delay={services.indexOf(service) * 80}>
              {/* Animation Border Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy to-accent scale-x-0 group-hover:scale-100 transition-transform duration-700 origin-left" />

              {/* Inner Technical Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(10,38,71,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-navy rounded-2xl lg:rounded-3xl flex items-center justify-center text-white text-xl lg:text-2xl mb-8 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-accent group-hover:shadow-[0_12px_30px_rgba(196,27,31,0.3)] transition-all duration-700">
                <i className={`fa-solid ${service.icon}`} />
              </div>

              <h3 className="text-2xl font-black text-navy mb-4 group-hover:text-accent transition-colors duration-500">{service.title}</h3>
              <p className="text-[1rem] text-mid leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity">{service.description}</p>

              <a href="#contact" className="inline-flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-widest text-navy hover:text-accent transition-all">
                Submit Inquiry <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-2" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
