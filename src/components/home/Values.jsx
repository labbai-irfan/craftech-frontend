import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contentApi } from '../../services/api';

const colorMap = { navy: '#0A2647', red: '#C41B1F', gold: '#D4AF37' };

const Values = () => {
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.getPillars()
      .then(({ data }) => {
        if (data.success) {
          setValues(data.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      })
      .catch(err => console.error('Failed to load pillars:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !values.length) return null;

  return (
    <section id="values" className="py-40 bg-white relative">
      <div className="container mx-auto px-8 relative z-10">

        {/* Modern Header Layout */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-24" data-aos="fade-up">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-1 bg-accent" />
              <span className="text-[0.8rem] font-black uppercase tracking-[5px] text-navy/30">The Foundation</span>
            </div>
            <h2 className="text-[clamp(2.5rem,4.5vw,4rem)] font-black text-navy leading-none tracking-tight">
              Our Core <br /> <span className="text-accent underline decoration-[6px] underline-offset-[12px]">Pillars.</span>
            </h2>
          </div>
          <p className="max-w-[450px] text-[1.1rem] text-mid font-medium mb-4">
            The fundamental ethics that have cemented our position as a trusted partner in Mumbai's elite construction landscape.
          </p>
        </div>

        {/* Feature Grid with Interlocking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:divide-x lg:divide-gray-100 border-y border-gray-100">
          {values.map((val, i) => (
            <div
              key={val._id}
              className="group p-12 hover:bg-light transition-colors duration-500 cursor-none"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="text-[3.5rem] font-black text-gray-50 group-hover:text-navy/5 transition-colors mb-8 -mt-4">
                0{i + 1}
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-center text-navy text-xl mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-navy group-hover:text-white">
                <i className={`fa-solid ${val.icon}`} />
              </div>

              <h4 className="text-xl font-extrabold text-navy mb-4 group-hover:translate-x-2 transition-transform duration-500">
                {val.title}
              </h4>
              <p className="text-[0.9rem] text-mid leading-[1.8] group-hover:translate-x-2 transition-transform duration-500 delay-75">
                {val.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Values;
