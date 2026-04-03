import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videoData = [
  {
    id: 1,
    title: 'DB Bhavan: The Transformation',
    category: 'Structural Evolution • 2:14 min',
    tag: 'Structural Architecture',
    poster: 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114625/25_mtkmve.jpg',
    videos: [
      { url: "https://res.cloudinary.com/dcx2gs6mm/video/upload/v1775114892/5_egkl3u.mp4", label: "Main Structural Phase" },
      { url: "https://res.cloudinary.com/dcx2gs6mm/video/upload/v1775114661/2_xos11l.mp4", label: "Column Casting" }
    ]
  },
  {
    id: 2,
    title: 'Ramzan Shaikh Site Execution',
    category: 'High-Quality Recap • 1:45 min',
    tag: 'Execution Precision',
    poster: 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114621/7_aknzm4.jpg',
    videos: [
      { url: "https://res.cloudinary.com/dcx2gs6mm/video/upload/v1775114678/1_stwtt6.mp4", label: "Execution Overview" }
    ]
  },
  {
    id: 3,
    title: 'Dr. Waqar Ansari Interiors',
    category: 'Luxury Walkthrough • 3:20 min',
    tag: 'Final Handover',
    poster: 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114383/20_inghex.jpg',
    videos: [
      { url: "https://res.cloudinary.com/dcx2gs6mm/video/upload/v1775114522/6_vmxy2l.mp4", label: "Interior Reveal" }
    ]
  }
];

const Videos = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const handleOpenGroup = (item) => {
    setSelectedGroup(item);
    setActiveVideo(item.videos[0]);
  };

  return (
    <section id="videos" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-8 lg:px-16">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 mb-20" data-aos="fade-up">
           <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[2px] bg-accent" />
                <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-blue/40">In Motion</span>
              </div>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-blue leading-[1.1] tracking-tighter">
                Visualizing <br /> <span className="text-accent italic font-black">Execution.</span>
              </h2>
           </div>
           <p className="max-w-[420px] text-mid font-medium text-[1.1rem] leading-relaxed mb-1 opacity-60">
             Experience the precision of Craftech Engineers through our on-site highlights and technical project walkthroughs.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videoData.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleOpenGroup(item)}
              className="group cursor-none"
            >
              <div className="relative rounded-[40px] overflow-hidden mb-8 aspect-video shadow-2xl group-hover:scale-105 transition-transform duration-700 bg-light">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-[1500ms] group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.poster})` }}
                />
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white text-3xl group-hover:scale-125 group-hover:bg-accent group-hover:border-accent shadow-2xl transition-all duration-700">
                    <i className="fa-solid fa-play ml-1.5" />
                  </div>
                </div>
                <div className="absolute top-8 left-8 py-2 px-5 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full text-[0.6rem] font-black uppercase tracking-[3px] text-white">
                  {item.tag}
                </div>
              </div>
              <div className="px-6 flex justify-between items-center group">
                <div className="flex flex-col">
                  <h4 className="text-2xl font-black text-blue mb-2 transition-colors group-hover:text-accent">{item.title}</h4>
                  <span className="text-[0.8rem] text-mid font-black uppercase tracking-[3px] leading-none">{item.category}</span>
                </div>
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-all duration-500">
                  <i className="fa-solid fa-arrow-right-long" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[9999] bg-white/95 flex flex-col"
          >
             <div className="px-12 py-8 flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-8">
                   <button 
                      onClick={() => { setSelectedGroup(null); setActiveVideo(null); }}
                      className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-blue hover:bg-accent hover:border-accent hover:text-white transition-all cursor-none"
                   >
                      <i className="fa-solid fa-xmark text-xl" />
                   </button>
                   <div className="flex flex-col">
                      <h3 className="text-xl font-black text-blue leading-none mb-1">{selectedGroup.title}</h3>
                      <span className="text-[0.6rem] font-black text-mid uppercase tracking-[4px]">{selectedGroup.tag}</span>
                   </div>
                </div>
             </div>

             <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-[2] bg-gray-50 flex items-center justify-center p-4 lg:p-12 relative overflow-hidden group">
                   <motion.div 
                     key={activeVideo.url}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="w-full relative rounded-3xl overflow-hidden shadow-2xl aspect-video border border-gray-100"
                   >
                      <video src={activeVideo.url} controls autoPlay className="w-full h-full object-contain bg-black" />
                   </motion.div>
                </div>
                <div className="flex-1 bg-white border-l border-gray-100 p-8 lg:p-12 overflow-y-auto">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-8 h-[1px] bg-accent" />
                      <span className="text-[0.7rem] font-black text-blue uppercase tracking-[5px]">Project Segments</span>
                   </div>
                   <div className="grid grid-cols-1 gap-6">
                      {selectedGroup.videos.map((vid, i) => (
                        <button key={i} onClick={() => setActiveVideo(vid)} className={`group flex items-center gap-6 p-6 rounded-3xl transition-all duration-500 text-left border cursor-none ${activeVideo.url === vid.url ? 'bg-blue border-blue text-white shadow-xl' : 'bg-light border-gray-100 hover:bg-gray-100 text-blue'}`}>
                           <div className={`w-14 h-14 rounded-2xl flex flex-shrink-0 items-center justify-center ${activeVideo.url === vid.url ? 'bg-white/20 text-white' : 'bg-blue/5 text-blue/40'}`}>
                              <i className="fa-solid fa-play text-xs" />
                           </div>
                           <h4 className="text-base font-black uppercase tracking-tight">{vid.label}</h4>
                        </button>
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

export default Videos;
