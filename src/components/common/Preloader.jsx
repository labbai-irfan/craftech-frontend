import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onFinish }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setIsDone(true);
        onFinish();
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (isDone) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Curtain Panels - Deep Professional Navy */}
      <motion.div
        initial={{ y: 0 }}
        animate={isLoaded ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
        className="absolute top-0 left-0 w-full h-1/2 bg-blue-dark z-[1]"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={isLoaded ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-dark z-[1]"
      />

      {/* Center Content */}
      <motion.div
        animate={isLoaded ? { opacity: 0, scale: 0.8, filter: 'blur(10px)' } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src="https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775115100/logo2_ecym5g.png"
            alt="Logo"
            className="w-[320px] md:w-[400px] "
          />
          {/* Subtle logo shine effect */}
          <motion.div 
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-[0.6rem] tracking-[5px] uppercase text-white/40 font-bold">
            Engineering Excellence
          </div>
          <div className="w-[200px] h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-gradient-to-r from-blue-light via-accent to-blue-light"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Preloader;
