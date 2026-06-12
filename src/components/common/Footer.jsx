import React from 'react';
import { useCMS } from '../../context/CMSContext';

const Footer = () => {
  const { settings } = useCMS();
  const quickLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About Us', href: '#about' },
    { name: 'Projects', href: '#portfolio' },
    { name: 'Videos', href: '#videos' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    { name: 'Building Construction', href: '#services' },
    { name: 'Interior Fit Outs', href: '#services' },
    { name: 'MEP Execution', href: '#services' },
    { name: 'Project Management', href: '#services' },
    { name: 'Cost Consultancy', href: '#services' },
  ];

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <img src="https://res.cloudinary.com/dcx2gs6mm/image/upload/v1775115100/logo2_ecym5g.png" alt="Logo" className="w-[220px]" />
            <div className="text-[0.58rem] font-bold text-mid tracking-[1.5px] uppercase -mt-4">Engineers Pvt. Ltd.</div>
            <p className="text-[0.9rem] text-mid leading-relaxed">
              Your single-stop partner for construction, MEP execution, interior fit-outs, and project management across Mumbai.
            </p>
            <div className="flex gap-4">
              {[
                { icon: 'fa-linkedin-in', link: settings?.socialLinks?.linkedin || '#' },
                { icon: 'fa-instagram', link: settings?.socialLinks?.instagram || '#' },
                { icon: 'fa-whatsapp', link: `https://wa.me/${(settings?.whatsappNumber || '919324877493').replace(/\D/g, '')}?text=Hi%20Craftech%2C%20I%20would%20like%20to%20inquire%20about%20your%20services` },
              ].map((s, i) => (
                <a key={i} href={s.link} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-navy hover:bg-navy hover:text-white hover:border-navy transition-all duration-300">
                  <i className={`fa-brands ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-navy mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-sm font-medium text-mid hover:text-navy hover:pl-2 transition-all flex items-center gap-2">
                    <i className="fa-solid fa-chevron-right text-[0.6rem]" /> {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-navy mb-8">Our Services</h4>
            <ul className="space-y-4">
              {services.map((l, i) => (
                <li key={i}>
                  <a href={l.href} className="text-sm font-medium text-mid hover:text-navy hover:pl-2 transition-all flex items-center gap-2">
                    <i className="fa-solid fa-chevron-right text-[0.6rem]" /> {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-navy mb-8">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <i className="fa-solid fa-phone text-navy mt-1" />
                <a href={`tel:${settings?.phone || '+919324877493'}`} className="text-sm font-black text-mid hover:text-navy transition-colors">{settings?.phone || '+91 93248 77493'}</a>
              </li>
              <li className="flex items-start gap-4">
                <i className="fa-solid fa-envelope text-navy mt-1" />
                <a href={`mailto:${settings?.email || 'info@craftechengineers.com'}`} className="text-sm font-black text-mid hover:text-navy transition-colors">{settings?.email || 'info@craftechengineers.com'}</a>
              </li>
              <li className="flex items-start gap-4">
                <i className="fa-solid fa-location-dot text-navy mt-1" />
                <span className="text-sm font-medium text-mid">Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 text-[0.8rem] font-bold text-mid uppercase tracking-[1px]">
          <p>© 2026 <span className="text-navy">Craftech Engineers Pvt. Ltd.</span> All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
