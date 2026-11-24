import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PILLARS } from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { ResilientImage } from './ResilientImage';

const CARD_THEMES = [
  'bg-white text-[#0F172A] border border-[#E9D5FF]',
  'bg-[#31006B] text-white border border-[#8B5CF6]/30',
  'bg-[#E9D5FF] text-[#0F172A] border border-[#C4B5FD]',
  'bg-gradient-to-br from-[#4B0BAA] to-[#31006B] text-white border border-[#8B5CF6]/40',
];

export const Pillars: React.FC = () => {
  return (
    <section className="relative bg-[#F8FAFC] pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="space-y-6 md:space-y-8">
          {PILLARS.map((pillar, idx) => {
            const isLightCard = idx === 0 || idx === 2;
            return (
              <article
                key={pillar.k}
                className={`grid items-center gap-8 rounded-[2rem] p-6 shadow-[0_24px_60px_rgba(49,0,107,0.12)] md:sticky md:top-24 md:grid-cols-12 md:p-12 ${CARD_THEMES[idx % CARD_THEMES.length]}`}
              >
                <div data-gsap-heading className="flex flex-col justify-between md:col-span-7">
                  <div
                    className={`flex items-center gap-4 font-display text-xs font-bold uppercase tracking-widest md:text-sm ${
                      isLightCard ? 'text-[#4B0BAA]' : 'text-[#C4B5FD]'
                    }`}
                  >
                    <span className="tabular-nums">0{idx + 1} / 04</span>
                    <span className="h-px w-12 bg-current" />
                    <span>Pillar</span>
                  </div>

                  <div className="mt-6 md:mt-10">
                    <h3
                      className={`font-display text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-4xl md:text-6xl ${
                        isLightCard
                          ? 'footer-text-glow footer-text-glow-light'
                          : 'footer-text-glow'
                      }`}
                    >
                      {pillar.k}
                    </h3>
                    <p className="mt-3 font-display text-lg font-semibold leading-snug md:mt-5 md:text-2xl">
                      {pillar.line}
                    </p>
                    <p
                      className={`mt-3 max-w-lg text-sm leading-relaxed md:mt-4 md:text-base ${
                        isLightCard ? 'text-[#64748B]' : 'text-[#E9D5FF]/85'
                      }`}
                    >
                      {pillar.body}
                    </p>

                    <a
                      href="#work"
                      data-cursor="See"
                      className={`mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:gap-4 ${
                        isLightCard
                          ? 'bg-[#4B0BAA] text-white hover:bg-[#31006B]'
                          : 'border border-[#8B5CF6] bg-[#4B0BAA] text-white hover:bg-[#8B5CF6]'
                      }`}
                    >
                      <span>See it in action</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div
                  data-gsap-reveal
                  data-gsap-delay="0.18"
                  data-gsap-duration="0.86"
                  className="relative flex items-center justify-center md:col-span-5"
                >
                  <div className="relative w-full max-w-[260px] rotate-2 transition-transform duration-500 hover:rotate-0 md:max-w-[330px]">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <ResilientImage
                        src={pillar.img}
                        alt={pillar.k}
                        className="aspect-[3/4] w-full object-cover"
                      />
                    </div>
                    <div className="absolute -right-4 -top-4 rounded-2xl border border-[#8B5CF6]/50 bg-[#31006B] p-2.5 shadow-xl md:-right-6 md:-top-6 md:p-3">
                      <BrandMark className="h-7 w-7 md:h-9 md:w-9" />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
