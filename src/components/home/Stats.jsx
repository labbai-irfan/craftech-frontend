import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const statsData = [
  { target: 25, label: 'Projects Executed' },
  { target: 18, label: 'Completed Deliveries' },
  { target: 10, label: 'Bespoke Clients' },
  { target: 12, label: 'Years Evolution' },
];

const Stats = () => {
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        statsData.forEach((stat, i) => {
          let start = 0;
          const end = stat.target;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCounts(prev => { const n = [...prev]; n[i] = end; return n; });
              clearInterval(timer);
            } else {
              setCounts(prev => { const n = [...prev]; n[i] = Math.floor(start); return n; });
            }
          }, 16);
        });
      }
    }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  return (
    <section id="stats" ref={sectionRef} className="bg-white py-24 relative">
       {/* Background Watermark - Minimalist Gray */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(5rem,15vw,12rem)] font-black tracking-[-0.05em] text-gray-50 whitespace-nowrap pointer-events-none select-none z-0">
         METRICS.
       </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {statsData.map((stat, i) => (
            <div key={i} className="text-center group" data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="text-[clamp(3.5rem,6vw,5.5rem)] font-black text-blue leading-none mb-3 flex items-baseline justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="tabular-nums">{counts[i]}</span>
                <span className="text-accent text-[0.45em] font-bold">+</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-[2px] w-8 bg-accent/20 group-hover:w-16 group-hover:bg-accent transition-all duration-500" />
                <div className="text-[0.75rem] font-black text-mid tracking-[3px] uppercase">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
