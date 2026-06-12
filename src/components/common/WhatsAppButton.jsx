import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../../context/CMSContext';

const WhatsAppButton = () => {
  const { settings } = useCMS();
  const phoneNumber = (settings?.whatsappNumber || '919324877493').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20Craftech%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <>
      {/* Desktop: floating button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-10 right-10 z-[5000] hidden lg:block"
      >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-500 hover:-translate-y-2 cursor-none"
      >
        <i className="fa-brands fa-whatsapp text-3xl" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 -z-10" />
        
        {/* Label Popup */}
        <div className="absolute right-20 py-3 px-6 bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 pointer-events-none whitespace-nowrap">
           <span className="text-[0.6rem] font-black text-mid uppercase tracking-[3px] mb-1 block leading-none saturate-0 group-hover:saturate-100">Live Support</span>
           <span className="text-sm font-black text-navy leading-none">Chat with Expertise</span>
        </div>
      </a>
      </motion.div>

      {/* Mobile: sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-[5000] lg:hidden grid grid-cols-2 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <a
          href={`tel:${settings?.phone || '+919324877493'}`}
          className="py-4 px-3 text-center font-bold text-sm text-navy hover:bg-light transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-phone text-lg" />
          <span className="hidden xs:inline">Call</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-4 px-3 text-center font-bold text-sm text-white bg-[#25D366] hover:bg-[#1fa855] transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-brands fa-whatsapp text-lg" />
          <span className="hidden xs:inline">WhatsApp</span>
        </a>
      </div>

      {/* Mobile padding to avoid content hidden behind sticky bar */}
      <div className="h-16 lg:h-0" />
    </>
  );
};

export default WhatsAppButton;
