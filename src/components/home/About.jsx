import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

const About = () => {
  const { homeData } = useCMS();
  
  if (!homeData) return null;

  const aboutData = {
    title: homeData.aboutTitle || 'The Art of Precision Engineering.',
    description: homeData.aboutDescription || 'Craftech Engineers Pvt. Ltd. is Mumbai\'s premier engineering and construction partner, specializing in high-performance structural execution, luxury interior fit-outs, and integrated MEP systems.',
    experienceYears: homeData.aboutExperienceYears || 12,
    mainImage: homeData.aboutMainImage || 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114389/22_axj37c.jpg',
    quote: homeData.aboutQuote || 'We don\'t just build structures; we engineer the foundations of trust and technical excellence.',
    quoteAuthor: homeData.aboutQuoteAuthor || 'Director, Craftech'
  };

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Text Content (Left) */}
          <div className="lg:col-span-6" data-aos="fade-right">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.7rem] font-black uppercase tracking-[6px] text-navy/40">Our Engineering DNA</span>
            </div>
            
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-navy leading-[1.05] tracking-tighter mb-10">
              {aboutData.title.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase().includes('precision') ? 'text-accent underline decoration-[6px] underline-offset-[8px]' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h2>
            
            <div className="space-y-6 text-[1.05rem] text-mid font-medium leading-relaxed mb-12">
              <p>{aboutData.description}</p>
            </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
              <div className="flex flex-col gap-3">
                <div className="text-3xl font-black text-navy">{aboutData.experienceYears}+</div>
                <div className="h-[2px] w-12 bg-accent/20" />
                <div className="text-[0.8rem] font-bold uppercase tracking-widest text-mid">Years of Mastery</div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-3xl font-black text-navy">25+</div>
                <div className="h-[2px] w-12 bg-accent/20" />
                <div className="text-[0.8rem] font-bold uppercase tracking-widest text-mid">Premium Projects Delivered</div>
              </div>
            </div>

            <div className="mt-16">
              <a href="#contact" className="group flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-white group-hover:bg-accent transition-all duration-500 transform group-hover:rotate-12">
                   <i className="fa-solid fa-arrow-right" />
                </div>
                <span className="text-navy font-black uppercase tracking-[4px] text-[0.8rem]">Explore Our Method</span>
              </a>
            </div>
          </div>

          {/* Visual Content (Right) */}
          <div className="lg:col-span-6 relative" data-aos="fade-left">
            <div className="relative rounded-[60px] overflow-hidden aspect-[4/5] group">
              <img 
                src={aboutData.mainImage} 
                alt="Construction Excellence" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-all duration-700" />
            </div>

            {/* Floating Quote Card */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -left-10 lg:-left-20 bg-white p-12 rounded-[40px] shadow-2xl max-w-[400px] border border-gray-100"
            >
              <i className="fa-solid fa-quote-left text-accent text-3xl mb-6 block" />
              <p className="text-xl font-bold text-navy italic mb-6 leading-snug">
                "{aboutData.quote}"
              </p>
              <div className="flex items-center gap-4">
                <span className="w-10 h-[1px] bg-accent" />
                <span className="text-[0.7rem] font-black uppercase tracking-[3px] text-mid">
                  {aboutData.quoteAuthor}
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
