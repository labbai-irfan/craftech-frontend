import React from 'react';
import { useCMS } from '../../context/CMSContext';

const Process = () => {
  const { processSteps } = useCMS();

  // Fallback data
  const steps = processSteps.length > 0 ? processSteps : [
    {
      number: '01',
      title: 'Consultation & Feasibility',
      description: 'We begin by understanding your vision and conducting a thorough technical analysis.'
    },
    {
      number: '02',
      title: 'Estimation & Resource Planning',
      description: 'Detail-oriented BOQ preparation and lean resource allocation to eliminate wastage.'
    },
    {
      number: '03',
      title: 'Precision Execution',
      description: 'Our on-site engineers and specialized MEP teams bring the project to life.'
    },
    {
      number: '04',
      title: 'Handover & Excellence',
      description: 'Final inspections and full documentation handover, ensuring zero snags.'
    },
  ];

  return (
    <section id="process" className="py-24 md:py-40 relative overflow-hidden bg-white">
      <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] bg-navy-light/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-[800px] mb-12 md:mb-20" data-aos="fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-navy/40">Our Method</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-navy leading-[1.1] tracking-tighter">
              Technical <br /> <span className="text-accent italic font-black">Blueprint.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:divide-x lg:divide-gray-100">
          {steps.map((step, i) => (
            <div key={i} className="group p-10 flex flex-col items-start text-left hover:bg-gray-50/50 transition-colors duration-500" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="text-[3.5rem] font-black text-gray-100 group-hover:text-navy/10 transition-colors duration-500 leading-none mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="flex w-6 h-6 items-center justify-center bg-navy text-white text-[0.65rem] rounded-full flex-shrink-0">{i + 1}</span>
                {step.title}
              </h3>
              <p className="text-sm text-mid leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
