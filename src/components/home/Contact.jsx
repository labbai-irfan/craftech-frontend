import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="max-w-4xl mb-20" data-aos="fade-right">
           <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-blue/40">Global Operations Hub</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-blue leading-[1.1] tracking-tighter">
              Ready to <br /> <span className="text-accent italic">Execute.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 border border-gray-100 rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.03)] bg-white relative">
          
          <div className="lg:col-span-12 xl:col-span-7 h-[500px] lg:h-[800px] relative group overflow-hidden">
             <iframe 
  title="Operations Map" 
  className="absolute inset-0 w-full h-full border-0 
  grayscale contrast-100 brightness-100 
  group-hover:grayscale-0 
  transition-all duration-500 ease-out"
  loading="lazy" 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5192.523752642171!2d72.8415131!3d19.140867999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7eee9aa0e35%3A0x8e2045ea442cfe34!2sWISETECH%20MEP%20CONSULTANTS%20Pvt.%20Ltd.!5e1!3m2!1sen!2sin!4v1768644227435!5m2!1sen!2sin"
/>
            
            
          </div>

          {/* RIGHT: EXECUTIVE INQUIRY DIVISION */}
          <div className="lg:col-span-12 xl:col-span-5 p-12 lg:p-20 flex flex-col relative z-10 bg-white">
             <div className="mb-12">
                <h3 className="text-3xl font-black text-blue mb-6 leading-none">Transmit Project Brief.</h3>
                <p className="text-sm font-medium text-mid leading-relaxed">
                  Our engineering leads will provide a comprehensive technical roadmap for your vision within 48 hours.
                </p>
             </div>

             <form className="space-y-8 flex-1">
                <div className="flex flex-col gap-8">
                   <div className="relative group">
                      <input type="text" placeholder="Full Stakeholder Identity" required 
                             className="w-full bg-light border-0 py-5 px-8 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-blue placeholder:text-mid/20 transition-all" />
                   </div>
                   <div className="relative group">
                      <input type="email" placeholder="Communication Email" required
                             className="w-full bg-light border-0 py-5 px-8 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-blue placeholder:text-mid/20 transition-all" />
                   </div>
                   <div className="relative group">
                      <select className="w-full bg-light border-0 py-5 px-8 rounded-2xl focus:ring-2 focus:ring-accent outline-none font-bold text-blue appearance-none">
                         <option value="">Select Domain Segment</option>
                         <option>Structural Execution</option>
                         <option>Premium Interior Fit Out</option>
                         <option>Integrated MEP Systems</option>
                         <option>PMC Consultancy</option>
                      </select>
                   </div>
                   <div className="relative group">
                      <textarea rows="4" placeholder="Brief Vision Disclosure / Message" required
                               className="w-full bg-light border-0 py-8 px-8 rounded-3xl focus:ring-2 focus:ring-accent outline-none font-bold text-blue placeholder:text-mid/20 transition-all resize-none" />
                   </div>
                </div>

                <div className="mt-8">
                   <button 
                     type="submit" 
                     className="w-full py-6 bg-blue text-white rounded-2xl text-[0.8rem] font-black uppercase tracking-[4px] shadow-2xl hover:bg-accent hover:-translate-y-2 transition-all duration-500 flex items-center justify-center gap-4 group/btn"
                   >
                     Initialize Protocol <i className="fa-solid fa-paper-plane text-xs transition-transform group-hover/btn:translate-x-3 group-hover/btn:-translate-y-3" />
                   </button>
                </div>
             </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
