import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import {
  SERVICES,
  PERFORMANCE_METRICS,
  AGENCY_CONTACT,
  buildWhatsAppUrl,
} from '../data/agencyData';
import { ResilientImage } from './ResilientImage';

const CHART_HEIGHTS = [32, 46, 40, 56, 48, 66, 60, 74, 68, 86, 80, 96];
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Services: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);

  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const smoothX = useSpring(previewX, { stiffness: 220, damping: 26 });
  const smoothY = useSpring(previewY, { stiffness: 220, damping: 26 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    previewX.set(e.clientX - rect.left);
    previewY.set(e.clientY - rect.top);
  };

  return (
    <section id="services" className="relative bg-[#31006B] py-20 text-white md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Section Header */}
        <div
          data-gsap-heading
          className="mb-10 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end md:gap-8"
        >
          <div className="md:col-span-7">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#C4B5FD]">
              Services
            </div>
            <h2 className="footer-text-glow font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-balance sm:text-5xl md:text-7xl">
              Nine capabilities. <span className="text-[#C4B5FD]">One growth engine.</span>
            </h2>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-sm leading-relaxed text-[#E9D5FF]/85 md:text-base">
              We help businesses build, connect and grow through creative thinking, strategic marketing and digital innovation.
            </p>
          </div>
        </div>

        {/* Interactive Service Rows + Floating Desktop Preview */}
        <div
          ref={listRef}
          data-gsap-stagger
          data-gsap-delay="0.12"
          data-gsap-stagger-step="0.055"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
          className="relative border-t border-[#C4B5FD]/25"
        >
          {/* Floating preview card on desktop */}
          <AnimatePresence>
            {hoveredIdx !== null && (
              <motion.div
                key={hoveredIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  x: smoothX,
                  y: smoothY,
                  translateX: '24px',
                  translateY: '-55%',
                }}
                className="pointer-events-none absolute left-0 top-0 z-30 hidden h-80 w-64 overflow-hidden rounded-2xl border border-[#C4B5FD]/45 bg-[#31006B] shadow-[0_24px_60px_rgba(15,23,42,0.65)] lg:block"
                aria-hidden="true"
              >
                <ResilientImage
                  src={SERVICES[hoveredIdx].img}
                  alt={SERVICES[hoveredIdx].title}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#31006B] via-[#31006B]/30 to-transparent" />
                <div className="absolute left-4 top-3 flex w-[calc(100%-2rem)] justify-between font-display text-[11px] font-bold uppercase text-[#C4B5FD]">
                  <span>{SERVICES[hoveredIdx].n}</span>
                  <span>BRANDFIY</span>
                </div>
                <div className="absolute inset-x-4 bottom-3">
                  <div className="font-display text-base font-black uppercase leading-tight text-white">
                    {SERVICES[hoveredIdx].title}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium text-[#E9D5FF]">
                    {SERVICES[hoveredIdx].tags.join(' · ')}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {SERVICES.map((service, idx) => {
            const isOpen = expandedIdx === idx;
            return (
              <div
                key={service.n}
                data-gsap-item
                onMouseEnter={() => setHoveredIdx(idx)}
                className="group border-b border-[#C4B5FD]/25 transition-colors duration-200 hover:bg-[#4B0BAA]/35"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  data-cursor="Explore"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6] md:py-6"
                >
                  <div className="flex min-w-0 items-baseline gap-4 md:gap-8">
                    <span className="font-display text-xs font-bold tabular-nums text-[#C4B5FD] md:text-sm">
                      {service.n}
                    </span>
                    <h3 className="footer-text-glow truncate font-display text-lg font-black uppercase tracking-tight text-white transition-transform duration-200 group-hover:translate-x-1.5 sm:text-2xl md:text-3xl lg:text-4xl">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex shrink-0 items-center gap-6">
                    <span className="hidden text-xs font-medium text-[#E9D5FF]/75 xl:inline">
                      {service.tags.join(' · ')}
                    </span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 ${
                        isOpen
                          ? 'border-[#8B5CF6] bg-[#4B0BAA] text-white'
                          : 'border-[#C4B5FD]/40 text-white group-hover:border-[#8B5CF6] group-hover:bg-[#4B0BAA]'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-5 pb-7 pt-1 md:grid-cols-12 md:items-center md:gap-8 md:pl-14">
                        <div className="md:col-span-6">
                          <p className="text-sm leading-relaxed text-[#E9D5FF] md:text-base">
                            {service.desc}
                          </p>
                          <div className="mt-3 text-xs font-medium text-[#C4B5FD]">
                            Deliverables: {service.deliverables}
                          </div>
                          <div className="mt-2 text-xs text-white/70">
                            {service.tags.join(' · ')}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-6 md:justify-end">
                          <div className="h-24 w-24 overflow-hidden rounded-xl border border-[#C4B5FD]/30 lg:hidden">
                            <ResilientImage
                              src={service.img}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <a
                            href={buildWhatsAppUrl(
                              AGENCY_CONTACT.phones[0].raw,
                              `Hi BRANDFIY! I'd like to discuss ${service.title}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#8B5CF6] bg-[#4B0BAA] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8B5CF6]"
                          >
                            <span>Request {service.title}</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Claim-to-Proof Performance Banner (from Brandfiy Presentation Slide 07) */}
        <div
          data-gsap-reveal
          data-gsap-delay="0.14"
          className="mt-14 rounded-3xl border border-[#C4B5FD]/25 bg-[#240052] p-6 md:mt-20 md:p-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#C4B5FD]">
                Campaign Performance Benchmark
              </div>
              <h3 className="footer-text-glow mt-2 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                Strategy + Creative that compounds
              </h3>
            </div>
            <span className="text-xs font-medium text-[#E9D5FF]/70">
              Meta Ads · Instagram Sponsored · Display Banners
            </span>
          </div>

          <div
            data-gsap-stagger
            data-gsap-delay="0.18"
            data-gsap-stagger-step="0.09"
            className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
          >
            {PERFORMANCE_METRICS.map((metric) => (
              <motion.div
                key={metric.label}
                data-gsap-item
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                className="rounded-2xl border border-[#C4B5FD]/20 bg-[#31006B] p-4 transition-colors duration-200 hover:border-[#8B5CF6]/70 md:p-6"
              >
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#C4B5FD]">
                  {metric.label}
                </div>
                <div className="mt-2 font-display text-3xl font-black tabular-nums text-white md:text-4xl">
                  {metric.value}
                </div>
                <div className="mt-1.5 text-xs text-[#E9D5FF]/70">{metric.detail}</div>
              </motion.div>
            ))}
          </div>

          {/* Minimalist growth bar visualization */}
          <div
            className="mt-8 flex h-24 items-end gap-2 sm:gap-3"
            aria-hidden="true"
          >
            {CHART_HEIGHTS.map((height, idx) => (
              <motion.div
                key={idx}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: idx * 0.03 }}
                style={{ height: `${height}%`, transformOrigin: 'bottom' }}
                className={`flex-1 rounded-t-md ${
                  idx >= 9 ? 'bg-[#8B5CF6]' : 'bg-[#4B0BAA]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
