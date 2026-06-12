import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMousePosition, lerp } from '../../hooks/useMousePosition';
import { useCMS } from '../../context/CMSContext';
import { copy } from '../../content/copy';

const DEFAULT_SLIDES = [
  {
    image: 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114390/31_j0lbxw.jpg',
    pos: 'center 40%',
    title: 'Building Legacy, Engineering Trust.',
    subtitle: 'Professional partner for turn-key construction and specialized MEP systems across Mumbai.',
  },
  {
    image: 'https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775114387/19_ibvdfz.jpg',
    pos: 'center center',
    title: 'Future Engineering, Iconic Architecture.',
    subtitle: 'Bliss Tower — redefining the urban skyline through technical mastery.',
  },
];

const Hero = () => {
  const { homeData } = useCMS();
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const { x, y } = useMousePosition();
  const orbPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const orbRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (homeData?.heroSlides?.length > 0) {
      setSlides(homeData.heroSlides);
    }
  }, [homeData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 1200);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [slides.length]);

  useEffect(() => {
    const animate = () => {
      if (orbRef.current) {
        orbPos.current.x = lerp(orbPos.current.x, x, 0.05);
        orbPos.current.y = lerp(orbPos.current.y, y, 0.05);
        orbRef.current.style.transform = `translate3d(${orbPos.current.x}px, ${orbPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [x, y]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const particles = Array.from({ length: 50 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, r: Math.random() * 1.5 }));
    const draw = () => {
      ctx.clearRect(0,0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-navy-dark">
      <canvas ref={canvasRef} className="absolute inset-0 z-[2] opacity-30 pointer-events-none" />

      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000"
            style={{ backgroundImage: `url(${slides[current]?.image})`, backgroundPosition: slides[current]?.pos || 'center center' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/40 to-transparent lg:from-navy-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div ref={orbRef} className="absolute w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,rgba(196,27,31,0.1)_0%,transparent_70%)] pointer-events-none z-[3] blur-[80px] hidden lg:block" />

      <div className="container mx-auto px-8 lg:px-20 relative z-10">
        <div className="max-w-[900px] mx-auto lg:mx-0 text-left">
          
          <motion.div initial={{ opacity:0 }} animate={isRevealed ? { opacity:1 } : {}} className="flex items-center justify-start gap-4 mb-8">
            <span className="w-12 h-[2px] bg-accent" />
            <span className="text-[0.65rem] font-black uppercase tracking-[5px] text-white/50">Precise Site Mastery</span>
          </motion.div>

          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black text-white leading-[1.05] tracking-tighter mb-10">
             <div className="overflow-hidden pb-1">
                <motion.span key={`t1-${current}`} initial={{ y: '100%' }} animate={isRevealed ? { y: 0 } : {}} transition={{ delay: 0.5, duration: 1.2, ease: [0.16,1,0.3,1] }} className="inline-block">
                  {slides[current]?.title?.split(',')[0]}
                  {slides[current]?.title?.includes(',') ? ',' : ''}
                </motion.span>
             </div>
             <div className="overflow-hidden -mt-2 lg:-mt-4">
                <motion.span key={`t2-${current}`} initial={{ y: '100%' }} animate={isRevealed ? { y: 0 } : {}} transition={{ delay: 0.7, duration: 1.2, ease: [0.16,1,0.3,1] }} className="inline-block text-accent italic font-black">
                  {slides[current]?.title?.split(',')[1] || ''}
                </motion.span>
             </div>
          </h1>

          <motion.p key={`p-${current}`} initial={{ opacity:0, y:20 }} animate={isRevealed ? { opacity:1, y:0 } : {}} transition={{ delay: 1 }} className="text-[1.1rem] lg:text-[1.3rem] text-white/70 font-medium mb-12 max-w-[650px] mx-auto lg:mx-0 leading-relaxed">
            {slides[current]?.subtitle}
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={isRevealed ? { opacity:1, y:0 } : {}} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row items-center justify-start gap-8">
            <a href="#portfolio" className="w-full sm:w-auto px-10 py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-[2px] text-[0.8rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/20 cursor-none">
              Discover Projects
            </a>
            <a href="#contact" className="group flex items-center gap-4 text-white hover:text-accent transition-all cursor-none">
               <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                  <i className="fa-solid fa-paper-plane text-xs" />
               </div>
               <span className="text-[0.8rem] font-black uppercase tracking-widest">{copy.hero.primaryCTA}</span>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-white/5 bg-navy-dark/50 backdrop-blur-md z-20 flex items-center overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap text-[0.6rem] font-bold text-white/20 uppercase tracking-[4px]">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="mx-8">• ISO 9001:2015 Structural Excellence • Precision MEP Integration • Mumbai Leading Fit-Out Partner • 12+ Years Industry Legacy • </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 60s linear infinite; }
      `}</style>
    </section>
  );
};

export default Hero;
