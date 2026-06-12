import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await projectsApi.getAll();
        if (data.success) setProjects(data.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['all', 'Structural Evolution', 'Luxury Fit-Out', 'Architecture & MEP', 'Building Construction'];
  
  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  return (
    <section id="portfolio" className="py-40 bg-white relative">
      <div className="container mx-auto px-8 relative z-10">
        
        {/* Modern Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-20" data-aos="fade-up">
           <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                 <span className="w-12 h-[2px] bg-accent" />
                 <span className="text-[0.7rem] font-black uppercase tracking-[5px] text-navy/40">Our Work</span>
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-navy leading-[1.1] tracking-tighter">
                Engineering <br /> <span className="text-accent italic font-black">Distinction.</span>
              </h2>
           </div>
           <p className="max-w-[400px] text-mid font-medium text-lg leading-relaxed mb-2 opacity-60">
             From luxury residences to complex hubs, we build the foundations of Mumbai's tomorrow.
           </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex gap-4 mb-16 overflow-x-auto pb-4 scrollbar-hide no-scrollbar" data-aos="fade-up">
          {categories.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-10 py-5 rounded-full text-[0.8rem] font-black uppercase tracking-[2px] transition-all duration-500 cursor-none ${
                filter === f ? 'bg-navy text-white shadow-2xl scale-105' : 'bg-light text-mid border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              {f === 'all' ? 'Featured Collection' : f}
            </button>
          ))}
        </div>

        {/* Uniform Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <Link
                key={project._id}
                to={`/case-study/${project._id}`}
                className="group relative rounded-[40px] overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 hover-lift"
              >
              <motion.div
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="aspect-[4/5] overflow-hidden group-hover:scale-105 transition-transform duration-1000">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Minimalist Professional Overlay */}
                <div className="absolute inset-x-8 bottom-8 p-10 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] opacity-0 group-hover:opacity-100 translate-y-10 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="text-[0.6rem] font-black uppercase tracking-[3px] text-white/50 mb-2">{project.category}</span>
                        <h4 className="text-2xl font-black text-white leading-none">{project.title}</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white">
                        <i className="fa-solid fa-arrow-up-right-from-square text-sm" />
                      </div>
                   </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* FULL-DETAIL PROJECT LIGHTBOX */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
            className="fixed inset-0 z-[9100] bg-white overflow-y-auto"
          >
             <div className="flex flex-col lg:flex-row min-h-screen">
                <div className="lg:w-[400px] xl:w-[450px] lg:h-screen lg:fixed lg:left-0 bg-light p-10 md:p-16 lg:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
                   <div className="z-10">
                      <button onClick={() => setSelectedProject(null)} className="mb-10 lg:mb-16 flex items-center gap-4 text-navy font-black uppercase text-[0.65rem] tracking-[4px] group transition-colors cursor-none">
                         <i className="fa-solid fa-arrow-left transition-transform group-hover:-translate-x-2" /> Back to Gallery
                      </button>
                      <span className="text-[0.6rem] font-black uppercase tracking-[5px] text-accent mb-4 lg:mb-6 block">{selectedProject.category}</span>
                      <h2 className="text-4xl lg:text-5xl font-black text-navy leading-tight mb-8 lg:mb-10">{selectedProject.title}</h2>
                      <div className="h-[4px] w-12 bg-navy mb-8 lg:mb-10" />
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                         <div className="flex flex-col">
                            <span className="text-[0.55rem] font-bold text-mid uppercase tracking-[3px] mb-2">Location</span>
                            <span className="text-navy font-black text-sm lg:text-lg">{selectedProject.location}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[0.55rem] font-bold text-mid uppercase tracking-[3px] mb-2">Stakeholder</span>
                            <span className="text-navy font-black text-sm lg:text-lg">{selectedProject.client}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[0.55rem] font-bold text-mid uppercase tracking-[3px] mb-2">Completion</span>
                            <span className="text-navy font-black text-sm lg:text-lg">{selectedProject.year}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 lg:ml-[400px] xl:ml-[450px] p-6 md:p-12 lg:p-20">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      {selectedProject.images.map((img, i) => (
                        <motion.div 
                           key={i} 
                           initial={{ opacity: 0, y: 30 }} 
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.2 + (i * 0.1) }}
                           className={`rounded-[24px] lg:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-none ${
                             i % 5 === 0 ? 'md:col-span-2 aspect-[4/3] md:aspect-[21/9]' : 'aspect-square'
                           }`}
                        >
                           <img src={img} alt="" className="w-full h-full object-cover" />
                        </motion.div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
