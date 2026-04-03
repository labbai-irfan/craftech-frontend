import React from 'react';

const ClientsMarquee = () => {
  const clients = [
    { icon: 'fa-building', name: 'DB Bhavan' },
    { icon: 'fa-tower-observation', name: 'Bliss Tower' },
    { icon: 'fa-house', name: 'Juhu Bungalow' },
    { icon: 'fa-stethoscope', name: 'Dr. Waqar Ansari' },
    { icon: 'fa-person-digging', name: 'Ramzan Shaikh' },
    { icon: 'fa-drafting-compass', name: 'ARC Associates' },
  ];

  return (
    <section id="clients" className="py-20 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="container mx-auto px-8 mb-10 flex flex-col items-center">
        <div className="text-center text-[0.75rem] font-black text-mid uppercase tracking-[6px] opacity-20">
          Industrial Trust & Project Legacies
        </div>
        <div className="h-[3px] w-12 bg-accent/20 mt-4 rounded-full" />
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee flex items-center whitespace-nowrap py-10">
          {[...clients, ...clients, ...clients, ...clients].map((client, i) => (
            <div key={i} className="mx-16 flex items-center gap-6 group/item cursor-none">
              <div className="w-14 h-14 bg-light rounded-full flex items-center justify-center text-blue/30 group-hover/item:text-blue group-hover/item:bg-blue/5 transition-all duration-500">
                <i className={`fa-solid ${client.icon} text-2xl`} />
              </div>
              <span className="text-[1.8rem] font-extrabold text-blue/10 group-hover/item:text-blue transition-all duration-700 uppercase tracking-tighter select-none">{client.name}</span>
            </div>
          ))}
        </div>
        
        {/* Cinematic Side Fades */}
        <div className="absolute inset-y-0 left-0 w-60 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-60 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientsMarquee;
