import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  LayoutGrid,
  MoveHorizontal,
  X,
} from 'lucide-react';
import {
  PORTFOLIO_WORKS,
  WORK_CATEGORIES,
  WorkCategory,
  WorkItem,
} from '../data/agencyData';
import { ResilientImage } from './ResilientImage';
import { ConcavePosterArc } from './ConcavePosterArc';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const portfolioCardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (colIndex: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      delay: colIndex * 0.08,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export const PortfolioSection: React.FC = () => {
  const [category, setCategory] = useState<WorkCategory>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [mobileDeckLayout, setMobileDeckLayout] = useState<'swipe' | 'grid'>('swipe');

  const secondaryRailRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<WorkCategory, number> = {
      All: PORTFOLIO_WORKS.length,
      Campaigns: 0,
      Branding: 0,
      'Digital Marketing': 0,
      Social: 0,
    };
    PORTFOLIO_WORKS.forEach((w) => {
      counts[w.cat] = (counts[w.cat] ?? 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(
    () =>
      category === 'All'
        ? PORTFOLIO_WORKS
        : PORTFOLIO_WORKS.filter((item) => item.cat === category),
    [category]
  );

  const featuredWorks =
    category === 'All' || category === 'Campaigns'
      ? filtered.filter((w) => w.featured)
      : [];
  const leadCampaign = featuredWorks[0] ?? null;
  const supportingCampaigns = featuredWorks.slice(1);

  const secondaryWorks = featuredWorks.length
    ? filtered.filter((w) => !w.featured)
    : filtered;

  const closeModal = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    setViewIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    if (secondaryRailRef.current) {
      secondaryRailRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [category]);

  useEffect(() => {
    if (activeIndex === null) return;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === null ? null : (prev + 1) % filtered.length));
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) =>
          prev === null ? null : (prev - 1 + filtered.length) % filtered.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeIndex, filtered.length]);

  const activeWork: WorkItem | null =
    activeIndex !== null ? filtered[activeIndex] ?? null : null;

  const openItem = (work: WorkItem) => {
    const idx = filtered.findIndex((item) => item.title === work.title);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const openWorkFromArc = (work: WorkItem) => {
    setCategory('All');
    const idx = PORTFOLIO_WORKS.findIndex((item) => item.title === work.title);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const scrollSecondaryRail = (dir: -1 | 1) => {
    const rail = secondaryRailRef.current;
    if (!rail) return;
    const step = Math.max(240, rail.clientWidth * 0.78);
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleModalTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleModalTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || activeIndex === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const diff = touchStartXRef.current - endX;
    touchStartXRef.current = null;
    if (Math.abs(diff) > 48) {
      setActiveIndex((prev) => {
        if (prev === null) return null;
        return diff > 0
          ? (prev + 1) % filtered.length
          : (prev - 1 + filtered.length) % filtered.length;
      });
    }
  };

  return (
    <section
      id="work"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_45%_at_50%_14%,rgba(139,92,246,0.16)_0%,transparent_72%),linear-gradient(180deg,#240052_0%,#31006B_52%,#28005A_100%)] text-white"
    >
      {/* Top 3D concave cylindrical poster arc */}
      <div data-gsap-reveal data-gsap-delay="0.06">
        <ConcavePosterArc works={PORTFOLIO_WORKS} onSelectWork={openWorkFromArc} />
      </div>

      {/* Main portfolio container */}
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-12 sm:px-6 md:px-10 md:pb-28 md:pt-24">
        {/* Heading + Responsive Filter Bar */}
        <div
          data-gsap-heading
          data-gsap-delay="0.08"
          className="mb-8 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
        >
          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#C4B5FD] md:mb-4">
              Selected work
            </div>
            <h2 className="footer-text-glow font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-balance sm:text-5xl md:text-6xl xl:text-7xl">
              Campaigns, brands,{' '}
              <span className="text-[#C4B5FD]">real impact</span>
            </h2>
          </div>

          {/* Single-line Horizontal Scroll Filter Rail on Mobile / Wrap on Desktop */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <div
              className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-[#C4B5FD]/25 bg-[#1B003F]/80 p-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap"
              role="group"
              aria-label="Filter projects by category"
            >
              {WORK_CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setActiveIndex(null);
                    }}
                    aria-pressed={selected}
                    className={`relative flex min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition duration-150 ${
                      selected
                        ? 'text-white'
                        : 'text-[#E9D5FF]/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="portfolioCategoryActive"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-[#8B5CF6] shadow-[0_6px_18px_rgba(139,92,246,0.4)]"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                    <span
                      className={`relative z-10 font-mono text-[10px] tabular-nums ${
                        selected ? 'text-white/90' : 'text-[#C4B5FD]/70'
                      }`}
                    >
                      {String(categoryCounts[cat]).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Flagship Brandfiy Campaigns Row (Lead Spotlight + Supporting Pair) */}
        {featuredWorks.length > 0 && (
          <div className="mb-14 md:mb-20">
            <div className="mb-6 flex items-center gap-4">
              <span className="footer-text-glow font-display text-xs font-black uppercase tracking-[0.28em] text-[#C4B5FD] sm:text-sm md:text-base">
                Flagship Campaigns
              </span>
              <span className="h-px flex-1 bg-[#C4B5FD]/25" />
              <span className="hidden text-xs font-medium text-[#E9D5FF]/70 sm:inline">
                3D key visuals &amp; editorial advertising
              </span>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Spotlight Hero Card (Lead Flagship Campaign) */}
              {leadCampaign && (
                <motion.article
                  key={`${category}-${leadCampaign.title}`}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={portfolioCardVariants}
                  onClick={() => openItem(leadCampaign)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openItem(leadCampaign);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  data-cursor="Expand"
                  aria-label={`View ${leadCampaign.title} for ${leadCampaign.client}`}
                  className="group grid cursor-pointer overflow-hidden rounded-3xl border border-[#C4B5FD]/25 bg-gradient-to-br from-[#230052] via-[#2C0064] to-[#1A003D] shadow-[0_24px_64px_rgba(10,0,28,0.45)] transition-colors duration-200 hover:border-[#8B5CF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6] lg:grid-cols-12 lg:items-stretch"
                >
                  {/* Visual Gallery Column (Preserves Full 4:5 Poster Artwork) */}
                  <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#140032] via-[#1B0044] to-[#12002B] p-6 sm:p-8 lg:col-span-5">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute h-56 w-56 rounded-full bg-[#8B5CF6]/20 blur-3xl transition-opacity duration-500 group-hover:opacity-90"
                    />
                    <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-2xl border border-[#C4B5FD]/25 bg-[#160035] shadow-[0_24px_56px_rgba(6,0,22,0.7)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.02]">
                      <ResilientImage
                        src={leadCampaign.images[0]}
                        alt={`${leadCampaign.title} — ${leadCampaign.client}`}
                        className="h-full w-full object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                      />
                    </div>

                    <span className="absolute left-4 top-4 rounded-xl border border-white/15 bg-[#1B0040]/85 px-3 py-1.5 font-mono text-xs font-bold tabular-nums text-[#E9D5FF] backdrop-blur-md">
                      01 · Spotlight
                    </span>
                  </div>

                  {/* Editorial Story & Quick Inspect Column */}
                  <div className="flex flex-col justify-between p-5 sm:p-8 lg:col-span-7 lg:p-10">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#C4B5FD]">
                        <span>{leadCampaign.client}</span>
                        <span className="font-mono tabular-nums text-[#E9D5FF]/75">
                          {leadCampaign.year}
                        </span>
                      </div>

                      <h3 className="footer-text-glow mt-3 font-display text-2xl font-black uppercase leading-tight text-white transition-colors group-hover:text-[#E9D5FF] sm:text-3xl lg:text-4xl">
                        {leadCampaign.title}
                      </h3>

                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E9D5FF]/85 md:text-base">
                        {leadCampaign.blurb}
                      </p>

                      <div className="mt-5 text-xs font-medium text-[#C4B5FD]/85">
                        {leadCampaign.tags.join(' · ')}
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5">
                      {leadCampaign.images.length > 1 ? (
                        <div className="flex items-center gap-2.5">
                          {leadCampaign.images.map((thumb, tIdx) => (
                            <div
                              key={thumb}
                              className="h-11 w-14 overflow-hidden rounded-lg border border-white/20 bg-[#140030]"
                            >
                              <ResilientImage
                                src={thumb}
                                alt={`${leadCampaign.title} frame ${tIdx + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                          <span className="text-[11px] font-medium text-[#E9D5FF]/70">
                            {leadCampaign.images.length} visuals
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#E9D5FF]/70">
                          {leadCampaign.cat}
                        </span>
                      )}

                      <span className="footer-glass-pill inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-white">
                        <span>Inspect Campaign</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Supporting Flagship Cards (2-up balanced grid) */}
              {supportingCampaigns.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 md:gap-8">
                  {supportingCampaigns.map((work, idx) => (
                    <motion.article
                      key={`${category}-${work.title}`}
                      custom={idx + 1}
                      initial="hidden"
                      animate="visible"
                      variants={portfolioCardVariants}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                      onClick={() => openItem(work)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openItem(work);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      data-cursor="Expand"
                      aria-label={`View ${work.title} for ${work.client}`}
                      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-[#C4B5FD]/25 bg-[#240052]/90 p-3.5 transition-colors duration-200 hover:border-[#8B5CF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6] sm:p-4"
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-[#160035]">
                        <div className="aspect-[4/5] w-full overflow-hidden">
                          <ResilientImage
                            src={work.images[0]}
                            alt={`${work.title} — ${work.client}`}
                            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </div>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#160035]/90 via-transparent to-transparent opacity-45 transition-opacity duration-300 group-hover:opacity-85" />

                        <span className="absolute left-3 top-3 rounded-lg bg-[#160035]/80 px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-[#E9D5FF] backdrop-blur-sm">
                          {String(idx + 2).padStart(2, '0')}
                        </span>

                        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4B0BAA] text-white shadow-lg transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                          <Expand className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="px-1.5 pb-1 pt-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="footer-text-glow font-display text-lg font-black leading-tight text-white transition-colors group-hover:text-[#C4B5FD] md:text-xl">
                            {work.title}
                          </h3>
                          <span className="shrink-0 font-mono text-xs tabular-nums text-[#C4B5FD]/80">
                            {work.year}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#E9D5FF]/75 sm:text-sm">
                          {work.blurb}
                        </p>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-medium text-[#C4B5FD]/85">
                          <span>{work.client}</span>
                          <span aria-hidden="true">·</span>
                          <span>{work.tags.join(' / ')}</span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secondary Posters, Social & Brand Identities */}
        {secondaryWorks.length > 0 && (
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 md:mb-7">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="footer-text-glow whitespace-nowrap font-display text-xs font-black uppercase tracking-[0.26em] text-white sm:text-sm md:text-base">
                  {featuredWorks.length > 0
                    ? 'Brand Suites & Social Systems'
                    : `${category} Archive`}
                </span>
                <span className="hidden h-px flex-1 bg-[#C4B5FD]/25 sm:block" />
              </div>

              {/* Mobile Deck Controls: Swipe vs Grid Toggle + Scroll Arrows */}
              <div className="flex items-center gap-2 sm:hidden">
                <div
                  role="group"
                  aria-label="Mobile portfolio layout"
                  className="inline-flex items-center rounded-xl border border-white/15 bg-[#1B003F]/85 p-1"
                >
                  <button
                    type="button"
                    onClick={() => setMobileDeckLayout('swipe')}
                    aria-pressed={mobileDeckLayout === 'swipe'}
                    aria-label="Swipe carousel layout"
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      mobileDeckLayout === 'swipe'
                        ? 'bg-[#8B5CF6] text-white'
                        : 'text-[#C4B5FD]/80'
                    }`}
                  >
                    <MoveHorizontal className="h-3.5 w-3.5" />
                    <span>Swipe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileDeckLayout('grid')}
                    aria-pressed={mobileDeckLayout === 'grid'}
                    aria-label="Stacked grid layout"
                    className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      mobileDeckLayout === 'grid'
                        ? 'bg-[#8B5CF6] text-white'
                        : 'text-[#C4B5FD]/80'
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={secondaryRailRef}
              className={
                mobileDeckLayout === 'swipe'
                  ? '-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-8 lg:grid-cols-3'
                  : 'grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-8 lg:grid-cols-3'
              }
            >
              {secondaryWorks.map((work, idx) => (
                <motion.article
                  key={`${category}-${work.title}`}
                  custom={idx % 3}
                  initial="hidden"
                  animate="visible"
                  variants={portfolioCardVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  onClick={() => openItem(work)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openItem(work);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  data-cursor="Expand"
                  aria-label={`View ${work.title} for ${work.client}`}
                  className={`group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#C4B5FD]/20 bg-[#230050]/85 p-3 transition-colors duration-200 hover:border-[#8B5CF6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6] md:rounded-3xl md:p-3.5 ${
                    mobileDeckLayout === 'swipe'
                      ? 'w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none'
                      : 'w-full'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl bg-[#160035] md:rounded-2xl">
                    <div className="aspect-[4/5] w-full overflow-hidden">
                      <ResilientImage
                        src={work.images[0]}
                        alt={`${work.title} — ${work.client}`}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#160035]/90 via-transparent to-transparent opacity-45 transition-opacity duration-300 group-hover:opacity-85" />

                    <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#4B0BAA] text-white shadow-lg transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </span>

                    <p className="pointer-events-none absolute inset-x-3.5 bottom-3.5 hidden max-w-[78%] translate-y-2 text-xs leading-relaxed text-[#E9D5FF] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
                      {work.blurb}
                    </p>
                  </div>

                  {/* Clean unboxed metadata + mobile readable caption */}
                  <div className="px-1.5 pb-1 pt-3.5">
                    <div className="flex items-baseline justify-between gap-2.5">
                      <h3 className="footer-text-glow font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-[#C4B5FD] md:text-lg">
                        {work.title}
                      </h3>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-[#C4B5FD]/75">
                        {work.year}
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#E9D5FF]/75 md:hidden">
                      {work.blurb}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-[#E9D5FF]/75">
                      <span>{work.client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-[#C4B5FD]">{work.cat}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Mobile Horizontal Rail Nudge Controls (only visible in Swipe mode) */}
            {mobileDeckLayout === 'swipe' && secondaryWorks.length > 1 && (
              <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
                <span className="text-[11px] font-medium text-[#C4B5FD]/80">
                  Swipe cards or tap to view details ({secondaryWorks.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollSecondaryRail(-1)}
                    aria-label="Scroll projects left"
                    className="footer-glass-pill flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSecondaryRail(1)}
                    aria-label="Scroll projects right"
                    className="footer-glass-pill flex h-10 w-10 items-center justify-center rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA bridge */}
        <div
          data-gsap-reveal
          data-gsap-delay="0.16"
          className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-[#C4B5FD]/25 pt-7 sm:flex-row sm:items-center"
        >
          <p className="max-w-md text-sm leading-relaxed text-[#E9D5FF]/80">
            Strategy-led campaigns, social systems and complete brand identities built to convert attention into growth.
          </p>
          <a
            href="#contact"
            data-cursor="Let's go"
            className="footer-glass-pill inline-flex min-h-[46px] w-full items-center justify-center gap-3 rounded-full px-6 py-3 font-display text-xs font-black uppercase tracking-wider text-white sm:w-auto"
          >
            <span>Your brand could be next</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Upgraded Mobile-Safe & Desktop-Flanked Lightbox Modal */}
      <AnimatePresence>
        {activeWork && activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label={activeWork.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#180038]/92 p-3 backdrop-blur-md sm:p-6 md:p-10"
          >
            {/* Desktop Flanking Arrows (outside card so they never cover imagery) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length);
              }}
              aria-label="Previous work"
              className="footer-glass-pill fixed left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full md:flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((activeIndex + 1) % filtered.length);
              }}
              aria-label="Next work"
              className="footer-glass-pill fixed right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full md:flex"
            >
              <ArrowRight className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleModalTouchStart}
              onTouchEnd={handleModalTouchEnd}
              className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#C4B5FD]/30 bg-[#240052] shadow-[0_32px_90px_rgba(6,0,22,0.8)]"
            >
              {/* Clean Top Modal Header Bar */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex min-w-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#C4B5FD]">
                  <span className="truncate">{activeWork.cat}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-white/90">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(filtered.length).padStart(2, '0')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#31006B] transition hover:rotate-90 hover:bg-[#E9D5FF]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="grid flex-1 items-center gap-6 overflow-y-auto p-4 sm:p-6 md:grid-cols-2 md:gap-10 md:p-8">
                <div>
                  <div className="overflow-hidden rounded-2xl border border-[#C4B5FD]/25 bg-[#160035] p-2 shadow-xl">
                    <ResilientImage
                      src={activeWork.images[viewIndex] || activeWork.images[0]}
                      alt={`${activeWork.title} — view ${viewIndex + 1}`}
                      loading="eager"
                      className="max-h-[44vh] w-full rounded-xl object-contain sm:max-h-[54vh] md:max-h-[62vh]"
                    />
                  </div>
                  {activeWork.images.length > 1 && (
                    <div className="mt-3.5 flex justify-center gap-2.5">
                      {activeWork.images.map((imgSrc, i) => (
                        <button
                          key={`${imgSrc}-${i}`}
                          type="button"
                          onClick={() => setViewIndex(i)}
                          aria-label={`View image ${i + 1} of ${activeWork.title}`}
                          className={`h-14 w-16 overflow-hidden rounded-xl border-2 transition ${
                            viewIndex === i
                              ? 'border-[#8B5CF6] shadow-md'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <ResilientImage
                            src={imgSrc}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-white">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#C4B5FD]">
                    <span>{activeWork.client}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{activeWork.year}</span>
                  </div>

                  <h3 className="footer-text-glow mt-2.5 font-display text-2xl font-black uppercase leading-tight sm:text-3xl md:text-4xl">
                    {activeWork.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-[#E9D5FF]/90 md:text-base">
                    {activeWork.blurb}
                  </p>

                  <div className="mt-5 border-t border-white/12 pt-4 text-xs font-semibold uppercase tracking-wider text-[#C4B5FD]">
                    Scope: {activeWork.tags.join(' · ')}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <a
                      href="#contact"
                      onClick={closeModal}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-display text-xs font-black uppercase tracking-wider text-[#31006B] transition hover:bg-[#E9D5FF] sm:w-auto"
                    >
                      <span>Start similar project</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Thumb-Friendly Bottom Prev / Next Bar */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#1B003F]/90 px-4 py-3 md:hidden">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length)
                  }
                  className="footer-glass-pill inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 text-xs font-bold uppercase tracking-wider text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>
                <span className="text-[11px] font-medium text-[#C4B5FD]/80">
                  Swipe to switch
                </span>
                <button
                  type="button"
                  onClick={() => setActiveIndex((activeIndex + 1) % filtered.length)}
                  className="footer-glass-pill inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 text-xs font-bold uppercase tracking-wider text-white"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
