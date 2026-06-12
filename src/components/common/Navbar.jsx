import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

const Navbar = () => {
  const { settings } = useCMS();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', href: '#hero' },
    { title: 'About', href: '#about' },
    { title: 'Services', href: '#services' },
    { title: 'Portfolio', href: '#portfolio' },
    { title: 'Videos', href: '#videos' },
    { title: 'Why Us', href: '#why' },
    { title: 'Contact', href: '#contact' },
  ];

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-[80px] lg:h-[100px] z-[5000] transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <a href="#hero" className="relative z-[5001]">
            <img
              src="https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775115100/logo2_ecym5g.png"
              alt="Craftech Logo"
              className={`w-[180px] lg:w-[240px] transition-all duration-500 ${!isScrolled && !isMobileMenuOpen ? 'brightness-0 invert' : ''}`}
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                className={`text-[0.75rem] font-bold uppercase tracking-[3px] py-2 relative group transition-colors duration-300 ${
                  isScrolled ? 'text-navy' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.title}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-500 rounded-full" />
              </a>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-8">
            <a
              href="#contact"
              className={`px-8 py-4 rounded-xl text-[0.7rem] font-black uppercase tracking-[3px] transition-all duration-500 ${
                isScrolled 
                ? 'bg-navy text-white shadow-xl hover:shadow-navy/20 hover:-translate-y-1' 
                : 'bg-white text-navy hover:bg-accent hover:text-white'
              }`}
            >
              Get Technical Quote
            </a>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden relative z-[5001] w-12 h-12 flex flex-col items-center justify-center gap-2 group"
          >
            <span className={`w-8 h-[2px] transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'bg-navy' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`w-8 h-[2px] transition-all duration-500 ${isScrolled || isMobileMenuOpen ? 'bg-navy' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-navy-dark/60 backdrop-blur-md z-[4998]"
            />
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white z-[4999] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] p-12 lg:p-20 flex flex-col justify-center"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.title}
                    variants={linkVariants}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl lg:text-5xl font-black text-navy hover:text-accent transition-colors duration-300 tracking-tighter"
                  >
                    {link.title}
                  </motion.a>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-gray-100 overflow-hidden">
                <motion.div variants={linkVariants} className="flex flex-col gap-6">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] font-black text-mid uppercase tracking-[4px] mb-2">Direct Contact</span>
                    <a href={`tel:${settings?.phone || '+919324877493'}`} className="text-xl font-black text-navy">{settings?.phone || '+91 93248 77493'}</a>
                  </div>
                  <a 
                    href="#contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-6 bg-navy text-white rounded-3xl text-center font-black uppercase tracking-[3px] text-sm"
                  >
                    Start a Project
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
