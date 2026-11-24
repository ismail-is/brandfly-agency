import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Expand,
  Laptop,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';
import {
  AGENCY_CONTACT,
  WEB_PROJECTS,
  WebProject,
  buildWhatsAppUrl,
} from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { ResilientImage } from './ResilientImage';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DeviceScreen: React.FC<{ project: WebProject; mode: DeviceMode }> = ({
  project,
  mode,
}) => {
  const isMobile = mode === 'mobile';
  const isTablet = mode === 'tablet';

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br ${project.bgTone} text-white`}
    >
      <ResilientImage
        src={project.img}
        alt={project.name}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#31006B] via-[#31006B]/55 to-[#31006B]/65" />

      {/* Top mini-nav inside simulated site */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest">
        <span className="font-display font-black text-white">{project.name}</span>
        {!isMobile && (
          <div className="flex items-center gap-3 text-[#E9D5FF]/80">
            <span>Collection</span>
            <span>Story</span>
            <span>Contact</span>
          </div>
        )}
        <span className="rounded-full bg-[#4B0BAA] px-2.5 py-0.5 text-[9px] font-bold text-white border border-[#8B5CF6]">
          {isMobile ? 'Menu' : project.ctaLabel}
        </span>
      </div>

      {/* Simulated hero inside device */}
      <div className={`relative z-10 p-4 ${isMobile ? 'pb-5' : isTablet ? 'p-6' : 'p-7 md:p-9'}`}>
        <div
          className="text-[9px] font-bold uppercase tracking-[0.28em]"
          style={{ color: project.accent }}
        >
          {project.kind}
        </div>
        <h4
          className={`mt-1.5 font-display font-black uppercase leading-[0.95] tracking-tight ${
            isMobile ? 'text-base' : isTablet ? 'text-xl' : 'text-2xl md:text-3xl'
          }`}
        >
          {project.heroTitle}
        </h4>
        <p className="mt-1.5 max-w-xs text-[11px] leading-snug text-[#E9D5FF]/90">
          {project.heroSubtitle}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-white/15 pt-3">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-xs font-black tabular-nums text-white">
                {m.value}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[#C4B5FD]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WebShowcase: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const total = WEB_PROJECTS.length;
  const hasOddLast = total % 2 === 1;

  const closeModal = useCallback(() => setSelectedIdx(null), []);

  useEffect(() => {
    setDeviceMode('desktop');
  }, [selectedIdx]);

  useEffect(() => {
    if (selectedIdx === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') {
        setSelectedIdx((prev) => (prev === null ? null : (prev + 1) % total));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIdx((prev) => (prev === null ? null : (prev - 1 + total) % total));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedIdx, total]);

  const activeProject = selectedIdx !== null ? WEB_PROJECTS[selectedIdx] : null;

  return (
    <section
      id="web"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 text-[#0F172A] md:py-32"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[#C4B5FD]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-36 h-[28rem] w-[28rem] rounded-full bg-[#E9D5FF]/60 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Header */}
        <div
          data-gsap-heading
          className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-12 md:gap-8"
        >
          <div className="md:col-span-7">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#4B0BAA]">
              Web development
            </div>
            <h2 className="footer-text-glow footer-text-glow-light font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-balance text-[#0F172A] sm:text-5xl md:text-7xl">
              Built to be <span className="text-outline-primary">seen.</span>
              <br />
              Engineered to <span className="text-[#4B0BAA]">perform.</span>
            </h2>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-sm leading-relaxed text-[#64748B] md:text-base">
              From tea houses to fragrance labels — every site here was designed and engineered in-house, then shipped responsive across phone, tablet and desktop. No templates, no page builders.
            </p>
            <a
              href={buildWhatsAppUrl(
                AGENCY_CONTACT.phones[0]?.raw ?? '919180429400',
                "Hi BRANDFIY! I'd like a custom responsive website for my business."
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Enquire"
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#4B0BAA] px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#31006B]"
            >
              <span>Start your website</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Scrolling project strip */}
        <div
          data-gsap-reveal
          data-gsap-delay="0.14"
          className="relative mb-14 overflow-hidden rounded-2xl border border-[#E9D5FF] bg-white shadow-xs md:mb-20"
          aria-hidden="true"
        >
          <div className="group">
            <div className="filmstrip-mask flex w-max items-center gap-8 py-4 animate-marquee group-hover:[animation-play-state:paused] md:gap-11">
              {[...WEB_PROJECTS, ...WEB_PROJECTS].map((site, idx) => (
                <span key={`${site.name}-${idx}`} className="flex items-center gap-4">
                  <ResilientImage
                    src={site.img}
                    alt={site.name}
                    className="h-11 w-16 rounded-lg object-cover ring-1 ring-[#C4B5FD] md:h-12 md:w-20"
                  />
                  <span className="whitespace-nowrap font-display text-sm font-black uppercase tracking-[0.18em] text-[#0F172A] md:text-base">
                    {site.name}
                  </span>
                  <BrandMark withBadge className="ml-3 h-7 w-7 shrink-0" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-device Case Study Grid */}
        <div
          data-gsap-stagger
          data-gsap-delay="0.1"
          data-gsap-stagger-step="0.11"
          className="grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-24"
        >
          {WEB_PROJECTS.map((project, idx) => {
            const isWide = hasOddLast && idx === total - 1;
            return (
              <article
                key={project.name}
                data-gsap-item
                onClick={() => setSelectedIdx(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIdx(idx);
                  }
                }}
                role="button"
                tabIndex={0}
                data-cursor="Preview"
                aria-label={`Preview ${project.name} responsive website`}
                className={`group cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA] ${
                  isWide ? 'md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-12' : ''
                }`}
              >
                {/* Layered Multi-Device Mockup Stage */}
                <div className="relative pb-6">
                  {/* Desktop Browser Frame */}
                  <div className="relative overflow-hidden rounded-2xl border border-[#C4B5FD] bg-[#31006B] shadow-[0_24px_60px_rgba(49,0,107,0.18)] transition-shadow duration-300 group-hover:shadow-[0_28px_70px_rgba(75,11,170,0.28)] md:rounded-3xl">
                    {/* Browser Chrome */}
                    <div className="flex items-center justify-between border-b border-white/15 bg-[#31006B] px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#C4B5FD]/50" />
                        <span className="h-2 w-2 rounded-full bg-[#C4B5FD]/50" />
                        <span className="h-2 w-2 rounded-full bg-[#C4B5FD]/50" />
                      </div>
                      <span className="truncate px-3 text-[10px] font-medium tracking-wider text-[#E9D5FF]/75">
                        {project.url}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4B5FD]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="aspect-[16/11] w-full overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                      <DeviceScreen project={project} mode="desktop" />
                    </div>

                    <span className="absolute bottom-4 left-4 z-20 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#4B0BAA] text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Floating Mobile & Tablet Responsive Previews */}
                  <div className="pointer-events-none absolute -bottom-3 right-3 z-20 flex items-end gap-2.5 md:right-6 md:gap-3">
                    <div className="w-[74px] rotate-3 overflow-hidden rounded-xl border-2 border-[#31006B] bg-[#31006B] shadow-[0_18px_36px_rgba(49,0,107,0.45)] transition-transform duration-500 group-hover:-translate-y-2 sm:w-[88px]">
                      <div className="aspect-[9/14] w-full">
                        <DeviceScreen project={project} mode="mobile" />
                      </div>
                    </div>
                    <div className="hidden w-[112px] -rotate-2 overflow-hidden rounded-xl border-2 border-[#31006B] bg-[#31006B] shadow-[0_18px_36px_rgba(49,0,107,0.45)] transition-transform duration-500 group-hover:-translate-y-3 sm:block">
                      <div className="aspect-[3/4] w-full">
                        <DeviceScreen project={project} mode="tablet" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Case study copy & clean unboxed metadata */}
                <div className={isWide ? 'mt-8 md:mt-0' : 'mt-7'}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="footer-text-glow footer-text-glow-light font-display text-2xl font-black uppercase tracking-tight text-[#0F172A] transition-colors group-hover:text-[#4B0BAA] md:text-3xl">
                      {project.name}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B] tabular-nums">
                      Case {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-[#64748B] md:text-base">
                    {project.blurb}
                  </p>
                  <div className="mt-3 text-xs font-semibold text-[#4B0BAA]">
                    {project.kind} · {project.tags.join(' / ')}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Engineering Pillars */}
        <div
          data-gsap-stagger
          data-gsap-delay="0.16"
          data-gsap-stagger-step="0.095"
          className="mt-16 grid gap-4 sm:grid-cols-3 md:mt-24"
        >
          {[
            [
              'Mobile-first',
              'Every layout is engineered for thumbs and small screens before scaling up to wide desktops.',
            ],
            [
              'Fast by default',
              'Lean components, optimised assets and clean semantic markup for sub-second first paint.',
            ],
            [
              'Built in-house',
              'Visual design and production code handled by the same team — zero handoff friction.',
            ],
          ].map(([title, copy]) => (
            <div
              key={title}
              data-gsap-item
              className="flex h-full gap-4 rounded-2xl border border-[#E9D5FF] bg-white p-6 shadow-xs transition-colors duration-200 hover:bg-[#E9D5FF]/40"
            >
              <BrandMark withBadge className="mt-0.5 h-9 w-9 shrink-0" />
              <div>
                <h3 className="footer-text-glow footer-text-glow-light font-display text-lg font-bold uppercase text-[#0F172A]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Device Interactive Preview Modal */}
      <AnimatePresence>
        {activeProject && selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeProject.name} multi-device preview`}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#31006B]/95 p-4 backdrop-blur-md md:p-10"
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close preview"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#31006B] transition hover:rotate-90 hover:bg-[#E9D5FF] md:right-6 md:top-6 md:h-12 md:w-12"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((selectedIdx - 1 + total) % total);
              }}
              aria-label="Previous website"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#C4B5FD]/40 bg-[#4B0BAA]/80 text-white transition hover:bg-[#8B5CF6] md:left-8 md:h-12 md:w-12"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx((selectedIdx + 1) % total);
              }}
              aria-label="Next website"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#C4B5FD]/40 bg-[#4B0BAA]/80 text-white transition hover:bg-[#8B5CF6] md:right-8 md:h-12 md:w-12"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="grid max-h-[90vh] w-full max-w-5xl items-center gap-6 overflow-y-auto px-2 md:grid-cols-12 md:gap-10"
            >
              {/* Live Device Viewport Switcher */}
              <div className="md:col-span-7">
                <div className="flex justify-center">
                  <div
                    className={`overflow-hidden rounded-2xl border border-[#C4B5FD]/35 bg-[#31006B] shadow-2xl transition-all duration-300 ${
                      deviceMode === 'desktop'
                        ? 'aspect-[16/10] w-full'
                        : deviceMode === 'tablet'
                        ? 'aspect-[3/4] w-full max-w-[360px]'
                        : 'aspect-[9/16] w-full max-w-[260px]'
                    }`}
                  >
                    <DeviceScreen project={activeProject} mode={deviceMode} />
                  </div>
                </div>

                {/* Device switcher buttons */}
                <div className="mt-5 flex justify-center gap-2">
                  {(
                    [
                      { id: 'desktop', label: 'Desktop', icon: Laptop },
                      { id: 'tablet', label: 'Tablet', icon: Tablet },
                      { id: 'mobile', label: 'Mobile', icon: Smartphone },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => {
                    const active = deviceMode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setDeviceMode(id)}
                        className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                          active
                            ? 'border-[#8B5CF6] bg-[#4B0BAA] text-white'
                            : 'border-[#C4B5FD]/30 text-[#E9D5FF]/80 hover:border-white hover:text-white'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Spec Details */}
              <div className="pb-4 text-white md:col-span-5 md:pb-0">
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#C4B5FD]">
                  {activeProject.kind} · Website
                </div>
                <h3 className="footer-text-glow mt-2 font-display text-3xl font-black uppercase leading-tight md:text-4xl">
                  {activeProject.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#E9D5FF]/85 md:text-base">
                  {activeProject.blurb}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4 border-y border-[#C4B5FD]/25 py-4">
                  {activeProject.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="font-display text-xl font-black tabular-nums text-[#C4B5FD]">
                        {metric.value}
                      </div>
                      <div className="mt-0.5 text-xs text-white/70">{metric.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs font-medium text-[#E9D5FF]/75">
                  Capabilities: {activeProject.tags.join(' · ')}
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                  <span className="tabular-nums">
                    Site {String(selectedIdx + 1).padStart(2, '0')} /{' '}
                    {String(total).padStart(2, '0')}
                  </span>
                  <a
                    href="#contact"
                    onClick={closeModal}
                    className="font-display font-bold uppercase tracking-wider text-[#C4B5FD] hover:text-white hover:underline"
                  >
                    Request a build
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
