import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { cmsApi } from '../../services/api';
import { Loader2 } from 'lucide-react';
import QuoteModal from './QuoteModal';

const Contact = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', phone: '', email: '', projectType: '', message: '', website: '' }
  });

  const onSubmit = async (values) => {
    try {
      await cmsApi.createLead({
        ...values,
        source: 'contact-form',
        sourceDetails: 'Contact form on website'
      });
      reset();
      toast.success('Thank you! We'll call within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please WhatsApp or call us directly.');
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hi Craftech, I would like to inquire about your services and get more information about your projects.');
    window.open(`https://wa.me/919324877493?text=${message}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const handleCallbackRequest = async () => {
    toast.success('Please check your email or WhatsApp for a callback within 2 hours.');
  };

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-8 lg:px-16">

        {/* Section Header */}
        <div className="max-w-4xl mb-20" data-aos="fade-right">
           <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[2px] bg-accent" />
              <span className="text-[0.75rem] font-black uppercase tracking-[5px] text-navy/40">Get in Touch</span>
           </div>
           <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-navy leading-[1.1] tracking-tighter">
              Let's <br /> <span className="text-accent italic">Build Together.</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 border border-gray-100 rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.03)] bg-white relative">

          {/* LEFT: Contact Info Card */}
          <div className="lg:col-span-12 xl:col-span-7 p-12 lg:p-20 bg-light flex flex-col justify-center">
             <div className="max-w-md">
                <h3 className="text-2xl font-black text-navy mb-8">Visit Our Office</h3>

                <div className="space-y-8">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0 text-navy">
                      <i className="fa-solid fa-location-dot text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy/50 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-lg font-bold text-navy">Mumbai, Maharashtra<br />India</p>
                      <p className="text-sm text-mid mt-2">Open Monday – Friday, 10 AM – 6 PM IST</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                      <i className="fa-solid fa-phone text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy/50 uppercase tracking-wide mb-1">Direct Line</p>
                      <a href="tel:+919324877493" className="text-lg font-black text-navy hover:text-accent transition-colors">+91 93248 77493</a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-600">
                      <i className="fa-brands fa-whatsapp text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy/50 uppercase tracking-wide mb-1">Quick Chat</p>
                      <a href="https://wa.me/919324877493?text=Hi%20Craftech%2C%20I'd%20like%20to%20inquire%20about%20your%20services" target="_blank" rel="noopener noreferrer" className="text-lg font-black text-navy hover:text-green-600 transition-colors">WhatsApp us</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0 text-navy">
                      <i className="fa-solid fa-envelope text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy/50 uppercase tracking-wide mb-1">Email</p>
                      <a href="mailto:info@craftechengineers.com" className="text-lg font-black text-navy hover:text-accent transition-colors">info@craftechengineers.com</a>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* RIGHT: INQUIRY FORM */}
          <div className="lg:col-span-12 xl:col-span-5 p-12 lg:p-20 flex flex-col relative z-10 bg-white">
             <div className="mb-12">
                <h3 className="text-3xl font-black text-navy mb-6 leading-none">Tell us about your project.</h3>
                <p className="text-sm font-medium text-mid leading-relaxed">
                  We'll review your brief and call within 24 hours with next steps.
                </p>
             </div>

             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1" noValidate>
                {/* Name */}
                <div className="relative">
                   <input
                     type="text"
                     placeholder="Your Name"
                     {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
                     className={`w-full bg-light border-0 py-4 px-6 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy placeholder:text-mid/40 transition-all ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                     disabled={isSubmitting}
                   />
                   {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div className="relative">
                   <input
                     type="tel"
                     placeholder="Phone / WhatsApp"
                     {...register('phone', {
                       required: 'Phone is required',
                       pattern: { value: /^[+\d][\d\s()-]{7,14}$/, message: 'Invalid phone format' }
                     })}
                     className={`w-full bg-light border-0 py-4 px-6 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy placeholder:text-mid/40 transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                     disabled={isSubmitting}
                   />
                   {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div className="relative">
                   <input
                     type="email"
                     placeholder="Email"
                     {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                     className={`w-full bg-light border-0 py-4 px-6 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy placeholder:text-mid/40 transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                     disabled={isSubmitting}
                   />
                   {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                {/* Project Type */}
                <div className="relative">
                   <select
                     {...register('projectType')}
                     className="w-full bg-light border-0 py-4 px-6 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy appearance-none disabled:opacity-50 transition-all"
                     disabled={isSubmitting}
                   >
                     <option value="">Project Type (Optional)</option>
                     <option value="Structural">Structural Work</option>
                     <option value="Interior">Interior Fit-Out</option>
                     <option value="MEP">MEP Systems</option>
                     <option value="Management">Project Management</option>
                     <option value="Other">Other</option>
                   </select>
                </div>

                {/* Message */}
                <div className="relative">
                   <textarea
                     placeholder="Tell us about your vision…"
                     rows={4}
                     {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Min 10 characters' }, maxLength: { value: 2000, message: 'Max 2000 chars' } })}
                     className={`w-full bg-light border-0 py-4 px-6 rounded-xl focus:ring-2 focus:ring-accent outline-none font-medium text-navy placeholder:text-mid/40 resize-none transition-all ${errors.message ? 'ring-2 ring-red-500' : ''}`}
                     disabled={isSubmitting}
                   />
                   {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
                </div>

                {/* Honeypot */}
                <input {...register('website')} type="hidden" tabIndex={-1} autoComplete="off" />

                {/* Submit & Quote CTA */}
                <div className="space-y-3 mt-8">
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full py-5 bg-navy text-white rounded-xl text-[0.8rem] font-black uppercase tracking-[3px] shadow-lg hover:bg-accent hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                   >
                     {isSubmitting ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Sending…
                       </>
                     ) : (
                       <>
                         <i className="fa-solid fa-paper-plane text-xs" />
                         Request a Call Back
                       </>
                     )}
                   </button>
                   <button
                     type="button"
                     onClick={() => setShowQuoteModal(true)}
                     className="w-full py-5 border-2 border-navy text-navy rounded-xl text-[0.8rem] font-black uppercase tracking-[3px] hover:bg-navy hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                   >
                     <i className="fa-solid fa-calculator text-xs" />
                     Get an Instant Quote
                   </button>
                </div>

                {/* Alternative Channels */}
                <div className="mt-10 pt-10 border-t border-gray-200">
                   <p className="text-xs font-bold text-mid uppercase tracking-[2px] mb-4">Or reach us via</p>
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       type="button"
                       onClick={handleWhatsAppClick}
                       className="py-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs uppercase tracking-[1px] transition-colors flex items-center justify-center gap-2"
                     >
                       <i className="fa-brands fa-whatsapp" />
                       WhatsApp
                     </button>
                     <a
                       href="tel:+919324877493"
                       className="py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-[1px] transition-colors flex items-center justify-center gap-2"
                     >
                       <i className="fa-solid fa-phone" />
                       Call Now
                     </a>
                   </div>
                </div>
             </form>
          </div>

        </div>
      </div>

      <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    </section>
  );
};

export default Contact;
