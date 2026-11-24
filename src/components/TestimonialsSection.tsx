import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
  Quote,
} from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';
import { ResilientImage } from './ResilientImage';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AUTOPLAY_INTERVAL_MS = 6000;

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 36 : -36,
    scale: 0.985,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -36 : 36,
    scale: 0.985,
    transition: {
      duration: 0.32,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const total = TESTIMONIALS.length;
  const activeItem = TESTIMONIALS[activeIndex];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === activeIndex) return;
      const normalized = (nextIndex + total) % total;
      setDirection(nextIndex > activeIndex ? 1 : -1);
      setActiveIndex(normalized);
    },
    [activeIndex, total]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const effectiveAutoPlay = isPlaying && !isHovered && !isReducedMotion;

  useEffect(() => {
    if (!effectiveAutoPlay) return;
    const timer = window.setInterval(goNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [effectiveAutoPlay, goNext]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  return (
    <section
      id="testimonials"
      className="hero-bg-gradient relative overflow-hidden py-20 text-white md:py-32"
    >
      <div className="grid-lines hero-grid-mask pointer-events-none absolute inset-0 opacity-45" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Section Header */}
        <div
          data-gsap-heading
          className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10"
        >
          <div>
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#C4B5FD]">
              Client Feedback
            </div>
            <h2 className="footer-text-glow font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-balance sm:text-5xl md:text-7xl">
              Trusted by founders who{' '}
              <span className="text-[#C4B5FD]">shipped results.</span>
            </h2>
          </div>

          {/* Slider Playback & Directional Controls */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? 'Pause testimonials slider' : 'Play testimonials slider'}
              className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-[#C4B5FD]/35 bg-[#240052]/80 px-4 text-xs font-semibold uppercase tracking-wider text-[#E9D5FF] backdrop-blur transition hover:border-white hover:bg-[#4B0BAA] hover:text-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Auto</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous client testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C4B5FD]/35 bg-[#240052]/80 text-white backdrop-blur transition hover:border-white hover:bg-[#4B0BAA]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next client testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C4B5FD]/35 bg-[#4B0BAA] text-white transition hover:border-white hover:bg-[#8B5CF6]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Auto-Playing Carousel Container */}
        <div
          data-gsap-reveal
          data-gsap-delay="0.15"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className="relative overflow-hidden rounded-3xl border border-[#C4B5FD]/25 bg-gradient-to-br from-[#240052]/95 via-[#31006B]/95 to-[#4B0BAA]/65 shadow-[0_28px_80px_rgba(12,0,32,0.55)] backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeItem.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid items-stretch lg:grid-cols-12"
            >
              {/* Left Side: Editorial Quote, Attribution & Measured Outcome */}
              <div className="flex flex-col justify-between p-6 sm:p-8 md:p-12 lg:col-span-8">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8B5CF6]/55 bg-[#4B0BAA] text-[#C4B5FD]">
                      <Quote className="h-5 w-5" />
                    </span>
                    <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#C4B5FD] tabular-nums">
                      {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(total).padStart(2, '0')}
                    </span>
                  </div>

                  <blockquote className="mt-7 font-display text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl md:mt-8 md:text-3xl md:leading-[1.28]">
                    “{activeItem.quote}”
                  </blockquote>
                </div>

                {/* Attribution + Outcome Footer */}
                <div className="mt-8 flex flex-col gap-6 border-t border-[#C4B5FD]/20 pt-6 sm:flex-row sm:items-end sm:justify-between md:mt-10">
                  <div>
                    <div className="font-display text-lg font-black text-white">
                      {activeItem.author}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#E9D5FF]/80 md:text-sm">
                      <span>{activeItem.role}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#C4B5FD]">{activeItem.company}</span>
                    </div>
                    <div className="mt-2 text-xs text-[#C4B5FD]/75">
                      {activeItem.scope}
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="font-display text-3xl font-black tabular-nums text-[#C4B5FD] md:text-4xl">
                      {activeItem.metricValue}
                    </div>
                    <div className="mt-1 text-xs font-medium text-[#E9D5FF]/80">
                      {activeItem.metricLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Adjacent Visual Proof Frame */}
              <div className="relative min-h-[240px] overflow-hidden border-t border-[#C4B5FD]/20 bg-[#1B003F] lg:col-span-4 lg:min-h-full lg:border-l lg:border-t-0">
                <ResilientImage
                  src={activeItem.projectImage}
                  alt={`${activeItem.company} — ${activeItem.scope}`}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1B003F] via-[#31006B]/30 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C4B5FD]">
                      Verified Case
                    </div>
                    <div className="mt-0.5 font-display text-base font-black text-white">
                      {activeItem.company}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    data-cursor="Let's go"
                    aria-label={`Start a project similar to ${activeItem.company}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C4B5FD]/45 bg-[#4B0BAA]/90 text-white backdrop-blur transition hover:border-white hover:bg-[#8B5CF6]"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Animated Auto-Play Progress Track along bottom edge */}
          <div className="h-1 w-full bg-[#1B003F]/80">
            {effectiveAutoPlay ? (
              <motion.div
                key={`progress-${activeIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: AUTOPLAY_INTERVAL_MS / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
                className="h-full w-full bg-gradient-to-r from-[#8B5CF6] via-[#C4B5FD] to-[#E9D5FF]"
              />
            ) : (
              <div
                style={{ transform: `scaleX(${(activeIndex + 1) / total})`, transformOrigin: 'left' }}
                className="h-full w-full bg-[#8B5CF6] transition-transform duration-300"
              />
            )}
          </div>
        </div>

        {/* Client Selector Strip (desktop/tablet named buttons + mobile responsive grid) */}
        <div
          data-gsap-stagger
          data-gsap-delay="0.2"
          data-gsap-stagger-step="0.06"
          className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
        >
          {TESTIMONIALS.map((item, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={item.id}
                data-gsap-item
                type="button"
                onClick={() => goTo(idx)}
                aria-pressed={active}
                className={`group flex min-h-[56px] flex-col justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6] ${
                  active
                    ? 'border-[#8B5CF6] bg-[#4B0BAA] text-white shadow-lg'
                    : 'border-[#C4B5FD]/20 bg-[#240052]/65 text-[#E9D5FF]/75 hover:border-[#C4B5FD]/45 hover:bg-[#31006B] hover:text-white'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="truncate font-display text-xs font-bold uppercase tracking-wider">
                    {item.company}
                  </span>
                  <span
                    className={`text-[11px] font-bold tabular-nums ${
                      active ? 'text-[#C4B5FD]' : 'text-[#C4B5FD]/50'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>
                <div className="mt-1 truncate text-[11px] text-[#C4B5FD]/80">
                  {item.metricValue} · {item.author}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
