import React from 'react';

const Process = () => {
  const steps = [
    {
      num: '01',
      title: 'Consultation & Feasibility',
      desc: 'We begin by understanding your vision and conducting a thorough technical analysis to determine project scope and budget.'
    },
    {
      num: '02',
      title: 'Estimation & Resource Planning',
      desc: 'Detail-oriented BOQ preparation and lean resource allocation to eliminate wastage and finalize timelines.'
    },
    {
      num: '03',
      title: 'Precision Execution',
      desc: 'Our on-site engineers and specialized MEP teams bring the project to life with rigorous quality control at every stage.'
    },
    {
      num: '04',
      title: 'Handover & Excellence',
      desc: 'Final inspections and full documentation handover, ensuring the space is ready for its intended use with zero snags.'
    },
  ];

  return (
    <section id="process" className="py-24 md:py-40 relative overflow-hidden bg-white">
      {/* Floating Blob */}
      <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] bg-blue-light/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-[800px] mb-12 md:mb-20" data-aos="fade-up">
           <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-blue/40">Our Method</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-blue leading-[1.1] tracking-tighter">
              Technical <br /> <span className="text-accent italic font-black">Blueprint.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:divide-x lg:divide-gray-100">
          {steps.map((step, i) => (
            <div key={i} className="group p-10 flex flex-col items-start text-left hover:bg-gray-50/50 transition-colors duration-500" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="text-[3.5rem] font-black text-gray-100 group-hover:text-blue/10 transition-colors duration-500 leading-none mb-6">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-3">
                <span className="flex w-6 h-6 items-center justify-center bg-blue text-white text-[0.65rem] rounded-full flex-shrink-0">{i + 1}</span>
                {step.title}
              </h3>
              <p className="text-sm text-mid leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
