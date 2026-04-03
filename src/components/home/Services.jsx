import React from 'react';

const Services = () => {
  const services = [
    { icon: 'fa-building', title: 'Building Construction', desc: 'End-to-end construction execution for residential, commercial, and hospitality projects — on time and within budget.' },
    { icon: 'fa-couch', title: 'Interior Fit Outs', desc: 'Premium interior solutions — concept to completion including modular kitchens, false ceilings, partitions & custom joinery.' },
    { icon: 'fa-wrench', title: 'MEP Execution', desc: 'Mechanical, electrical & plumbing execution with precision — HVAC, fire-fighting, water supply, drainage and electrical systems.' },
    { icon: 'fa-diagram-project', title: 'Project Management', desc: 'Expert PMC ensuring quality assurance, schedule management, stakeholder coordination & risk mitigation across all phases.' },
    { icon: 'fa-ruler-combined', title: 'Quantity Survey', desc: 'Accurate BOQ preparation, material estimation & quantity verification based on construction drawings to control procurement.' },
    { icon: 'fa-coins', title: 'Cost Consultancy', desc: 'Detailed cost planning, value engineering & budget control to maximise ROI while maintaining the highest quality standards.' },
  ];

  return (
    <section id="services" className="py-24 md:py-40 bg-light relative overflow-hidden">
      {/* Precision Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A2647 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-[800px] mb-12 md:mb-20" data-aos="fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.7rem] font-black uppercase tracking-[5px] text-blue/40">Our Architecture of Service</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-blue leading-[1.1] tracking-tighter">
              Domain <br /> <span className="text-accent italic font-black">Specialization.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, i) => (
            <div key={i} className="group relative p-12 bg-white rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden hover:-translate-y-3 cursor-none" data-aos="fade-up" data-aos-delay={i * 80}>
              {/* Animation Border Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue to-accent scale-x-0 group-hover:scale-100 transition-transform duration-700 origin-left" />

              {/* Inner Technical Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(10,38,71,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue rounded-2xl lg:rounded-3xl flex items-center justify-center text-white text-xl lg:text-2xl mb-8 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-accent group-hover:shadow-[0_12px_30px_rgba(196,27,31,0.3)] transition-all duration-700">
                <i className={`fa-solid ${service.icon}`} />
              </div>

              <h3 className="text-2xl font-black text-blue mb-4 group-hover:text-accent transition-colors duration-500">{service.title}</h3>
              <p className="text-[1rem] text-mid leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity">{service.desc}</p>

              <a href="#contact" className="inline-flex items-center gap-3 text-[0.7rem] font-black uppercase tracking-widest text-blue hover:text-accent transition-all">
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
