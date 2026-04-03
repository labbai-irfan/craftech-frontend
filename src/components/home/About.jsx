import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Text Content */}
          <div className="lg:col-span-7" data-aos="fade-right">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-blue/40">
                Crafting Excellence since 2012
              </span>
            </div>
            
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold text-blue leading-[1.05] tracking-tighter mb-10">
              The Art of <span className="text-accent underline decoration-4 underline-offset-8">Precision</span> <br /> 
              Engineering.
            </h2>
            
            <div className="max-w-[650px] space-y-8">
              <p className="text-[1.15rem] font-medium text-dark leading-relaxed">
                <span className="text-blue font-bold">Craftech Engineers Pvt. Ltd.</span> is more than a construction firm. 
                We are a single-point hub for visionaries seeking absolute precision in MEP execution, 
                specialized EPC contracting, and custom interior fit-out solutions.
              </p>
              
              <p className="text-[1rem] text-mid leading-loose">
                With a decade-long track record across Mumbai's elite residential and commercial sectors, 
                we implement <strong>Lean Construction</strong> workflows — a strict discipline that 
                eliminates wastage and maximizes value at every phase of the project lifecycle.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
                <div className="flex flex-col gap-3">
                  <div className="text-3xl font-black text-blue">120+</div>
                  <div className="h-[2px] w-12 bg-accent/20" />
                  <div className="text-[0.8rem] font-bold uppercase tracking-widest text-mid">Successful projects</div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-3xl font-black text-blue">12Y</div>
                  <div className="h-[2px] w-12 bg-accent/20" />
                  <div className="text-[0.8rem] font-bold uppercase tracking-widest text-mid">Of Industry leadership</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Content - Overlapping Images */}
          <div className="lg:col-span-5 relative" data-aos="fade-left">
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl group">
              <img
                src="https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114377/39_s4jqut.jpg"
                alt="Construction"
                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
              />
              {/* Glass Info Card Over Image */}
              <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-[32px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                <p className="text-white text-sm font-medium italic opacity-90 mb-4">
                  "Complexity is our canvas. Engineering is our medium."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white">
                    <i className="fa-solid fa-hard-hat" />
                  </div>
                  <span className="text-white font-bold text-xs uppercase tracking-widest">Waqar Ansari Project</span>
                </div>
              </div>
            </div>
            
            {/* Tertiary Image */}
            <div className="absolute -bottom-16 -left-20 w-64 aspect-[1/1] rounded-[32px] overflow-hidden border-[12px] border-white shadow-2xl hidden xl:block">
              <img
                 src="https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114387/19_ibvdfz.jpg"
                 alt="Detail"
                 className="w-full h-full object-cover"
              />
            </div>
            
            {/* Experience Tag with rotation */}
            <div className="absolute top-20 -right-12 w-40 h-40 bg-white shadow-2xl rounded-full flex flex-col items-center justify-center border border-gray-50 z-20 hover:scale-110 transition-transform cursor-none">
               <div className="text-4xl font-black text-blue">12+</div>
               <div className="text-[0.6rem] font-bold text-mid uppercase tracking-widest text-center mt-1">Years of<br />Excellence</div>
               {/* Slow rotation text */}
               <div className="absolute inset-2 animate-[spin_10s_linear_infinite]">
                 {/* This could be a circular text path if needed */}
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
