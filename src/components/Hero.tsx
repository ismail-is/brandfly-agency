import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowUpRight,
  MousePointer2,
  PhoneCall,
} from 'lucide-react';
import {
  AGENCY_CONTACT,
  PERFORMANCE_METRICS,
  UPLOADED_POSTERS,
  GENERATED_MEDIA,
} from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { ResilientImage } from './ResilientImage';
import { ScrollDownIndicator } from './ScrollDownIndicator';

interface HeroProps {
  ready: boolean;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HERO_PHRASES = [
  'Digital Reality',
  'Brand Identity',
  'Growth Engines',
  '4K Brand Films',
];

const HERO_DISCIPLINES = [
  {
    index: '01',
    title: 'Brand Identity',
    detail: 'Logos, Packaging & Systems',
    href: '#studio',
  },
  {
    index: '02',
    title: 'Performance Ads',
    detail: `${PERFORMANCE_METRICS[3].value} Verified ROAS`,
    href: '#work',
  },
  {
    index: '03',
    title: '4K Video & Social',
    detail: '248+ Campaigns Shipped',
    href: '#services',
  },
  {
    index: '04',
    title: 'Web Engineering',
    detail: '0.7s Custom Storefronts',
    href: '#web',
  },
];

export const Hero: React.FC<HeroProps> = ({ ready }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const mouseX = useMotionValue(720);
  const mouseY = useMotionValue(320);
  const smoothX = useSpring(mouseX, { stiffness: 95, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 95, damping: 24 });

  const pointerGlow = useMotionTemplate`radial-gradient(560px circle at ${smoothX}px ${smoothY}px, rgba(139, 92, 246, 0.14), rgba(196, 181, 253, 0.08) 42%, transparent 72%)`;

  const parallaxLeftX = useTransform(smoothX, [0, 1440], [10, -10]);
  const parallaxLeftY = useTransform(smoothY, [0, 900], [8, -8]);
  const parallaxRightX = useTransform(smoothX, [0, 1440], [-10, 10]);
  const parallaxRightY = useTransform(smoothY, [0, 900], [-8, 8]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const floatLeftScrollY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const floatRightScrollY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  useEffect(() => {
    if (!ready || paused) return;
    const timer = window.setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [ready, paused]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleCyclePhrase = () => {
    setPhraseIdx((prev) => (prev + 1) % HERO_PHRASES.length);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="hero-light-radiant relative flex min-h-[100svh] flex-col justify-between overflow-hidden text-[#0F172A]"
    >
      {/* Subtle Light Perspective Grid + Interactive Lavender Pointer Spotlight */}
      <div className="hero-grid-mask grid-lines-light pointer-events-none absolute inset-0 opacity-75" />
      <motion.div
        style={{ background: pointerGlow }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Soft Breathing Atmospheric Lavender Orbs */}
      <motion.div
        animate={{ scale: [1, 1.07, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none -bottom-24 left-1/4 absolute h-72 w-72 rounded-full bg-[#C4B5FD]/45 blur-3xl md:h-[26rem] md:w-[26rem]"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none -bottom-20 right-1/5 absolute h-72 w-72 rounded-full bg-[#8B5CF6]/28 blur-3xl md:h-[24rem] md:w-[24rem]"
      />

      {/* Main Centered Hero Stage */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-5 pb-8 pt-28 md:px-10 md:pb-10 md:pt-36">
        <motion.div
          style={{ y: stageY }}
          className="relative flex w-full flex-col items-center text-center"
        >
          {/* Floating Left Kinetic Anchor (Desktop) */}
          <motion.div
            style={{
              x: parallaxLeftX,
              y: parallaxLeftY,
            }}
            initial={{ opacity: 0, x: -36, y: 12 }}
            animate={
              ready ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -36, y: 12 }
            }
            transition={{ duration: 0.75, delay: 0.34, ease: EASE_OUT_EXPO }}
            className="pointer-events-auto absolute left-0 top-1/2 hidden -translate-y-1/2 xl:left-4 lg:block"
          >
            <motion.a
              href="#work"
              style={{ y: floatLeftScrollY }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              data-cursor="Case Study"
              className="group relative flex items-center gap-3 rounded-2xl border border-[#C4B5FD]/75 bg-white/90 p-2.5 pr-4 text-left shadow-[0_18px_40px_rgba(75,11,170,0.14)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#8B5CF6]"
            >
              <ResilientImage
                src={UPLOADED_POSTERS.digitalMarketingEngine}
                alt="Digital Marketing Growth Engine campaign"
                loading="eager"
                fallbackTitle="4.8x ROAS"
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-[#E9D5FF]"
              />
              <div>
                <div className="font-display text-sm font-black tabular-nums text-[#31006B]">
                  {PERFORMANCE_METRICS[3].value} ROAS
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  Paid Creative Scale
                </div>
              </div>
              <span
                aria-hidden="true"
                className=" -right-3 -top-3 absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#4B0BAA] text-white shadow-md transition-transform group-hover:scale-110"
              >
                <MousePointer2 className="h-3.5 w-3.5 -rotate-90" />
              </span>
            </motion.a>
          </motion.div>

          {/* Floating Right Kinetic Anchor (Desktop) */}
          <motion.div
            style={{
              x: parallaxRightX,
              y: parallaxRightY,
            }}
            initial={{ opacity: 0, x: 36, y: 12 }}
            animate={
              ready ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 36, y: 12 }
            }
            transition={{ duration: 0.75, delay: 0.42, ease: EASE_OUT_EXPO }}
            className="pointer-events-auto absolute right-0 top-[56%] hidden -translate-y-1/2 xl:right-4 lg:block"
          >
            <motion.a
              href="#web"
              style={{ y: floatRightScrollY }}
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
              data-cursor="Web Showcase"
              className="group relative flex items-center gap-3 rounded-2xl border border-[#C4B5FD]/75 bg-white/90 p-2.5 pr-4 text-left shadow-[0_18px_40px_rgba(75,11,170,0.14)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#8B5CF6]"
            >
              <ResilientImage
                src={GENERATED_MEDIA.eloraWeb}
                alt="Elora Botanicals storefront build"
                loading="eager"
                fallbackTitle="248+ Projects"
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-[#E9D5FF]"
              />
              <div>
                <div className="font-display text-sm font-black tabular-nums text-[#31006B]">
                  248+ Shipped
                </div>
                <div className="text-[11px] font-medium text-[#64748B]">
                  Brands & Fast Web
                </div>
              </div>
              <span
                aria-hidden="true"
                className="-left-3 -top-3 absolute flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5CF6] text-white shadow-md transition-transform group-hover:scale-110"
              >
                <MousePointer2 className="h-3.5 w-3.5" />
              </span>
            </motion.a>
          </motion.div>

          {/* Clean Unboxed Editorial Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="mb-5 flex items-center justify-center gap-2.5 text-xs font-semibold tracking-wide text-[#4B0BAA] sm:text-sm"
          >
            <BrandMark withBadge className="h-6 w-6 rounded-lg" />
            <span>{AGENCY_CONTACT.brandName}</span>
            <span aria-hidden="true" className="text-[#8B5CF6]">
              ·
            </span>
            <span className="text-[#475569]">{AGENCY_CONTACT.tagline}</span>
          </motion.div>

          {/* Centered Bold Headline with Animated Purple Highlight Block */}
          <h1 className="footer-text-glow footer-text-glow-light max-w-4xl font-display text-4xl font-extrabold leading-[1.12] tracking-[-0.03em] text-balance text-[#0F172A] sm:text-5xl md:text-6xl xl:text-[4.15rem]">
            <span className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={
                  ready ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }
                }
                transition={{ duration: 0.65, delay: 0.05, ease: EASE_OUT_EXPO }}
                className="block"
              >
                Transform Your Vision Into
              </motion.span>
            </span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.65, delay: 0.14, ease: EASE_OUT_EXPO }}
              className="mt-2 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2.5"
            >
              <span>Bold</span>

              <button
                type="button"
                onClick={handleCyclePhrase}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                aria-label={`Highlight theme: ${HERO_PHRASES[phraseIdx]}. Click to preview next capability.`}
                title="Click to preview next capability"
                className="relative inline-flex min-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#4B0BAA] via-[#6D28D9] to-[#8B5CF6] px-5 py-2 text-white shadow-[0_16px_36px_rgba(75,11,170,0.3)] transition-transform duration-200 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA] active:scale-[0.98] sm:min-w-[330px] sm:px-6 sm:py-2.5"
              >
                {/* Animated diagonal sheen across the highlight block */}
                <span
                  aria-hidden="true"
                  className="hero-highlight-sheen pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                <AnimatePresence mode="wait">
                  <motion.span
                    key={HERO_PHRASES[phraseIdx]}
                    initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {HERO_PHRASES[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
              </button>
            </motion.span>
          </h1>

          {/* Concise Value Proposition Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE_OUT_EXPO }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg"
          >
            We build geometric brand identities, campaign visuals, 4K commercials, and fast custom websites that turn everyday attention into measurable revenue.
          </motion.p>

          {/* Dual CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE_OUT_EXPO }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <a
              href="#contact"
              data-cursor="Let's Talk"
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-[#4B0BAA] to-[#8B5CF6] px-7 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[0_14px_30px_rgba(75,11,170,0.3)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA] active:scale-[0.98]"
            >
              <PhoneCall className="h-4 w-4 shrink-0" />
              <span>Book a Discovery Call</span>
            </a>

            <a
              href="#work"
              data-cursor="Explore"
              className="footer-glass-pill footer-glass-pill-light inline-flex min-h-[48px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 py-3.5 font-display text-xs font-bold uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA]"
            >
              <span>Explore Work</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>
          </motion.div>

          {/* Interactive Discipline Anchor Bar (Full-Width 4-Column Row Below Hero Stage) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.65, delay: 0.38, ease: EASE_OUT_EXPO }}
            className="mt-12 w-full max-w-5xl rounded-2xl border border-[#C4B5FD]/60 bg-white/80 p-2 shadow-[0_20px_50px_rgba(49,0,107,0.1)] backdrop-blur-md sm:mt-14"
          >
            <div className="grid grid-cols-1 divide-y divide-[#E9D5FF] text-left sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {HERO_DISCIPLINES.map((item) => (
                <a
                  key={item.index}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition duration-150 hover:bg-[#F3E8FF]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4B0BAA]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold tabular-nums text-[#8B5CF6]">
                        {item.index}.
                      </span>
                      <span className="truncate font-display text-xs font-bold text-[#0F172A] sm:text-sm">
                        {item.title}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs font-medium tabular-nums text-[#64748B]">
                      {item.detail}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#8B5CF6] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#4B0BAA]" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <ScrollDownIndicator
        ready={ready}
        href="#services"
        scrollYProgress={scrollYProgress}
      />
    </section>
  );
};
