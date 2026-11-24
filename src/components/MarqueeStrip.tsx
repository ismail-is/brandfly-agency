import React from 'react';
import { MARQUEE_CLIENTS, MARQUEE_SERVICES } from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { ResilientImage } from './ResilientImage';

export const MarqueeStrip: React.FC = () => {
  const servicesLoop = [...MARQUEE_SERVICES, ...MARQUEE_SERVICES];
  const clientsLoop = [...MARQUEE_CLIENTS, ...MARQUEE_CLIENTS];

  return (
    <section
      aria-label="Services and featured client collaborations"
      className="relative z-10 overflow-hidden border-y border-[#C4B5FD]/20 bg-[#31006B]"
    >
      {/* Top ticker: Core capabilities */}
      <div data-gsap-reveal data-gsap-delay="0" className="group" aria-hidden="true">
        <div className="filmstrip-mask flex w-max items-center gap-10 py-5 animate-marquee group-hover:[animation-play-state:paused] md:gap-14 md:py-7">
          {servicesLoop.map((service, idx) => (
            <span
              key={`${service}-${idx}`}
              className="flex items-center gap-10 md:gap-14"
            >
              <span
                className={`whitespace-nowrap font-display text-2xl font-black uppercase leading-none tracking-tight md:text-5xl lg:text-6xl ${
                  idx % 2 === 0 ? 'text-white' : 'text-outline-violet'
                }`}
              >
                {service}
              </span>
              <BrandMark className="h-5 w-5 shrink-0 opacity-90 md:h-8 md:w-8" />
            </span>
          ))}
        </div>
      </div>

      {/* Bottom ticker: Reverse client thumbnails */}
      <div
        data-gsap-reveal
        data-gsap-delay="0.14"
        className="group border-t border-[#C4B5FD]/15 bg-[#4B0BAA]/35"
        aria-hidden="true"
      >
        <div className="filmstrip-mask flex w-max items-center gap-7 py-3.5 animate-marquee-rev group-hover:[animation-play-state:paused] md:gap-10">
          {clientsLoop.map((client, idx) => (
            <span
              key={`${client.name}-${idx}`}
              className="flex items-center gap-3 md:gap-3.5"
            >
              <ResilientImage
                src={client.img}
                alt={client.name}
                className="h-9 w-14 rounded-md object-cover ring-1 ring-[#C4B5FD]/50 transition group-hover:ring-[#8B5CF6] md:h-11 md:w-16"
              />
              <span className="whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.2em] text-[#E9D5FF] md:text-sm">
                {client.name}
              </span>
              <span className="ml-4 text-xs leading-none text-[#C4B5FD]/70 md:ml-6">
                /
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
