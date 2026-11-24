import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Layers, ScanLine, Sparkles } from 'lucide-react';
import {
  BRAND_LOGOS,
  FOUNDERS,
  LOGO_ANATOMY,
  STUDIO_STATS,
  buildWhatsAppUrl,
} from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { BrandParticleStage, BrandStageMode } from './BrandParticleStage';

const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({
  value,
  suffix,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(value);
      return;
    }

    const start = performance.now();
    const duration = 900;
    let raf = 0;

    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setCount(Math.round(eased * value));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

const LOGO_SWATCHES = [
  {
    id: 'obsidian',
    label: 'Obsidian',
    bg: 'bg-[#090114]',
    border: 'border-[#8B5CF6]/55',
    caption: 'Luminous Contrast · Digital & Motion',
  },
  {
    id: 'primary',
    label: 'Primary',
    bg: 'bg-[#4B0BAA]',
    border: 'border-[#8B5CF6]',
    caption: 'White on Primary Purple (#4B0BAA)',
  },
  {
    id: 'deep',
    label: 'Deep',
    bg: 'bg-[#31006B]',
    border: 'border-[#C4B5FD]/45',
    caption: 'White on Deep Purple (#31006B)',
  },
  {
    id: 'violet',
    label: 'Violet',
    bg: 'bg-[#8B5CF6]',
    border: 'border-[#E9D5FF]',
    caption: 'White on Electric Violet (#8B5CF6)',
  },
] as const;

const STAGE_MODES: { id: BrandStageMode; label: string; icon: React.ReactNode }[] = [
  { id: 'particles', label: 'Particles', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'blueprint', label: 'Blueprint', icon: <ScanLine className="h-3.5 w-3.5" /> },
  { id: 'solid', label: 'Solid Mark', icon: <Layers className="h-3.5 w-3.5" /> },
];

export const StudioSection: React.FC = () => {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [selectedPart, setSelectedPart] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState(0);
  const [stageMode, setStageMode] = useState<BrandStageMode>('particles');

  const handlePillarSelect = (idx: number) => {
    const next = activePillar === idx ? null : idx;
    setActivePillar(next);
    if (next !== null) {
      // Map Create -> 01 Solid B, Connect -> 03 Opening, Grow -> 02 Negative F
      setSelectedPart(next === 0 ? 0 : next === 1 ? 2 : 1);
    }
  };

  return (
    <section
      id="studio"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_75%_55%_at_76%_18%,rgba(139,92,246,0.28)_0%,rgba(75,11,170,0.18)_42%,transparent_76%),radial-gradient(ellipse_60%_50%_at_12%_78%,rgba(139,92,246,0.16)_0%,transparent_72%),linear-gradient(180deg,#080112_0%,#14022B_44%,#21004B_80%,#31006B_100%)] py-20 text-white md:py-28"
    >
      {/* Atmospheric studio grid & soft perimeter vignette */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_90%_85%_at_50%_35%,#000_25%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Top Hero Split: Studio Voice + Interactive Particle Brand Monogram */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div data-gsap-heading className="lg:col-span-6">
            <div className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#C4B5FD]">
              The studio &amp; brand anatomy
            </div>
            <h2 className="footer-text-glow font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-balance sm:text-5xl md:text-7xl">
              Create. Connect.
              <br />
              <span className="text-[#C4B5FD]">Grow.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#E9D5FF]/85 md:mt-7 md:text-lg">
              BRANDFIY is brand + fiy: to make, to shape. One word, one promise — we turn
              ambitious businesses into unforgettable brands.
            </p>

            {/* Quick Pillar Synchronizer Controls */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {FOUNDERS.map((pillar, idx) => {
                const isSelected = activePillar === idx;
                return (
                  <button
                    key={pillar.name}
                    type="button"
                    onClick={() => handlePillarSelect(idx)}
                    aria-pressed={isSelected}
                    className={`min-h-[42px] whitespace-nowrap rounded-xl border px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition duration-150 ${
                      isSelected
                        ? 'border-[#C4B5FD] bg-[#8B5CF6] text-white shadow-[0_0_24px_rgba(139,92,246,0.45)]'
                        : 'border-white/15 bg-white/[0.04] text-[#E9D5FF]/85 hover:border-[#8B5CF6]/70 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    0{idx + 1} · {pillar.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Luminous Particle Monogram Stage (Ref-inspired cosmic violet particles) */}
          <div
            data-gsap-reveal
            data-gsap-delay="0.18"
            data-gsap-duration="0.9"
            className="lg:col-span-6"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] font-medium text-[#C4B5FD]/85">
                Move pointer across monogram to interact
              </div>

              {/* Render Mode Segmented Switcher */}
              <div
                role="tablist"
                aria-label="Monogram display mode"
                className="inline-flex items-center gap-1 rounded-xl border border-white/12 bg-[#120329]/85 p-1"
              >
                {STAGE_MODES.map((m) => {
                  const active = stageMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setStageMode(m.id)}
                      className={`inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition duration-150 ${
                        active
                          ? 'bg-[#4B0BAA] text-white shadow-sm'
                          : 'text-[#C4B5FD]/75 hover:text-white'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <BrandParticleStage
              activeAnatomy={selectedPart}
              activePillar={activePillar}
              mode={stageMode}
              swatchBg={LOGO_SWATCHES[selectedSwatch].bg}
              onAnatomySelect={(idx) => {
                setSelectedPart(idx);
                setActivePillar(null);
              }}
            />
          </div>
        </div>

        {/* Interactive Logo Construction & Symbolism Explorer */}
        <div
          data-gsap-reveal
          data-gsap-delay="0.14"
          className="mt-14 rounded-3xl border border-[#C4B5FD]/20 bg-[#120329]/80 p-6 backdrop-blur-md md:mt-20 md:p-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#C4B5FD]">
                Logo Construction &amp; Symbolism
              </div>
              <h3 className="footer-text-glow mt-2 font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                Built with mathematical precision
              </h3>
            </div>
            <div className="font-mono text-xs font-medium tabular-nums text-[#E9D5FF]/75">
              45° cuts · 24 U F-stroke · 16 px min legible size
            </div>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Swatch Proof & Minimum Scale Check */}
            <div className="space-y-4 lg:col-span-5">
              <div
                className={`relative flex aspect-square max-h-[320px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 transition-colors duration-300 ${LOGO_SWATCHES[selectedSwatch].bg} ${LOGO_SWATCHES[selectedSwatch].border}`}
              >
                <div
                  aria-hidden="true"
                  className="grid-lines pointer-events-none absolute inset-0 opacity-45"
                />

                <motion.img
                  key={`${selectedPart}-${selectedSwatch}`}
                  initial={{ scale: 0.94, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  src={BRAND_LOGOS.icon}
                  alt="BRANDFIY B+F Geometric Monogram"
                  className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.45)] md:h-40 md:w-40"
                />

                <div className="relative z-10 mt-5 text-center">
                  <div className="font-display text-xs font-bold uppercase tracking-widest text-white">
                    {LOGO_ANATOMY[selectedPart].pillar}
                  </div>
                  <div className="mt-1 text-[11px] text-[#E9D5FF]/80">
                    {LOGO_SWATCHES[selectedSwatch].caption}
                  </div>
                </div>

                {/* Real 16px & 24px Legibility Proof */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-xl border border-white/15 bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                  <img
                    src={BRAND_LOGOS.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                  />
                  <span className="font-mono text-[10px] tabular-nums text-[#E9D5FF]/85">
                    16px min
                  </span>
                </div>
              </div>

              {/* Surface Swatch Selector */}
              <div className="grid grid-cols-4 gap-2">
                {LOGO_SWATCHES.map((swatch, idx) => (
                  <button
                    key={swatch.id}
                    type="button"
                    onClick={() => setSelectedSwatch(idx)}
                    aria-pressed={selectedSwatch === idx}
                    className={`min-h-[42px] whitespace-nowrap rounded-xl border px-2 py-2 text-xs font-semibold transition duration-150 ${
                      selectedSwatch === idx
                        ? 'border-[#C4B5FD] bg-[#4B0BAA] text-white shadow-sm'
                        : 'border-white/12 bg-white/[0.04] text-[#E9D5FF]/75 hover:border-[#8B5CF6]/60 hover:text-white'
                    }`}
                  >
                    {swatch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive 3-Part Breakdown Selector */}
            <div className="space-y-2.5 lg:col-span-7">
              {LOGO_ANATOMY.map((part, idx) => {
                const active = selectedPart === idx;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      setSelectedPart(idx);
                      setActivePillar(null);
                    }}
                    aria-pressed={active}
                    className={`group relative block w-full rounded-xl px-4 py-5 text-left transition-all duration-200 md:px-6 md:py-6 ${
                      active
                        ? 'bg-[#4B0BAA]/45 ring-1 ring-inset ring-[#8B5CF6]/70'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-display text-xs font-bold uppercase tracking-widest text-[#C4B5FD]">
                        {part.code}
                      </span>
                      <span className="font-mono text-xs font-medium tabular-nums text-[#E9D5FF]/75">
                        {part.spec}
                      </span>
                    </div>
                    <h4 className="footer-text-glow mt-2 font-display text-lg font-black uppercase text-white md:text-xl">
                      {part.title} — <span className="text-[#C4B5FD]">{part.pillar}</span>
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#E9D5FF]/85">
                      {part.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3 Core Discipline Cards */}
        <div
          data-gsap-stagger
          data-gsap-delay="0.12"
          data-gsap-stagger-step="0.1"
          className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-8"
        >
          {FOUNDERS.map((pillar, idx) => {
            const isHighlighted = activePillar === idx;
            return (
              <article
                key={pillar.name}
                data-gsap-item
                onMouseEnter={() => handlePillarSelect(idx)}
                onMouseLeave={() => setActivePillar(null)}
                onClick={() => handlePillarSelect(idx)}
                data-cursor="Explore"
                className={`group flex cursor-pointer flex-col justify-between rounded-2xl border p-6 transition-all duration-200 md:rounded-3xl md:p-8 ${
                  isHighlighted
                    ? 'border-[#8B5CF6] bg-[#3B0785]/70 shadow-[0_20px_56px_rgba(139,92,246,0.22)]'
                    : 'border-white/12 bg-[#160433]/80 hover:border-[#8B5CF6]/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-[#C4B5FD] tabular-nums">
                      0{idx + 1} · {pillar.short}
                    </span>
                    <BrandMark className="h-6 w-6 opacity-85 transition-transform duration-200 group-hover:scale-110" />
                  </div>

                  <div className="mt-6 flex items-baseline gap-3">
                    <h3 className="footer-text-glow font-display text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                      {pillar.name}
                    </h3>
                  </div>

                  <div className="mt-1 text-xs font-medium text-[#C4B5FD]">
                    {pillar.role}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#E9D5FF]/85">
                    {pillar.bio}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="text-xs font-medium text-[#E9D5FF]/75">
                    {pillar.focus.join(' · ')}
                  </div>
                  <a
                    href={buildWhatsAppUrl(
                      pillar.wa,
                      `Hi BRANDFIY! I'd like to talk about ${pillar.name} (${pillar.short}).`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C4B5FD] transition hover:text-white"
                  >
                    <span>Discuss {pillar.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Clean Tabular Studio Metrics Strip */}
        <div
          data-gsap-stagger
          data-gsap-delay="0.16"
          data-gsap-stagger-step="0.085"
          className="mt-12 grid grid-cols-2 gap-6 border-t border-white/12 pt-10 md:mt-16 md:grid-cols-4 md:gap-8"
        >
          {STUDIO_STATS.map((stat) => (
            <div
              key={stat.label}
              data-gsap-item
              className="rounded-2xl border border-white/12 bg-[#160433]/75 p-5 md:p-7"
            >
              <div className="footer-text-glow font-display text-4xl font-black text-[#C4B5FD] md:text-6xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-[#E9D5FF]/80 md:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
