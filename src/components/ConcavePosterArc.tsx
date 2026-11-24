import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';
import { WorkItem } from '../data/agencyData';
import { ResilientImage } from './ResilientImage';

interface ConcavePosterArcProps {
  works: WorkItem[];
  onSelectWork?: (work: WorkItem) => void;
}

export const ConcavePosterArc: React.FC<ConcavePosterArcProps> = ({
  works,
  onSelectWork,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverMixRefs = useRef<number[]>([]);

  const offsetRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragLastXRef = useRef(0);
  const dragMovedRef = useRef(0);
  const hoveredCardRef = useRef<number | null>(null);
  const widthRef = useRef(1440);
  const lastFocusedIdxRef = useRef(0);

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const items = works.slice(0, 9);
  const count = items.length;

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateWidth = () => {
      widthRef.current = el.clientWidth || 1440;
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layoutCards = useCallback(
    (dt: number) => {
      if (count === 0) return;
      const vw = widthRef.current;
      const isMobile = vw < 640;
      const isTablet = vw >= 640 && vw < 1024;

      // Cylindrical concave arc geometry tuned per breakpoint
      const radius = isMobile ? 640 : isTablet ? 940 : 1260;
      const thetaStep = isMobile ? 0.275 : isTablet ? 0.215 : 0.185;
      const visibleHalfSlots = isMobile ? 1.65 : isTablet ? 2.45 : 3.2;
      const lerpAlpha = prefersReduced ? 1 : 1 - Math.exp(-14 * dt);

      for (let i = 0; i < count; i++) {
        const node = cardRefs.current[i];
        if (!node) continue;

        let d = (((i - offsetRef.current) % count) + count) % count;
        if (d > count / 2) d -= count;

        const absD = Math.abs(d);
        const angle = d * thetaStep;
        const clampedAngle = Math.max(-1.05, Math.min(1.05, angle));

        // Cylindrical concave X & Z projection: outer wings sweep gently toward viewer
        const x = radius * Math.sin(clampedAngle);
        const norm = Math.min(absD / visibleHalfSlots, 1.35);
        const curve = norm * norm;

        // Balanced scale so center stays crisp & legible while wings frame naturally
        const baseScale = isMobile
          ? 0.85 + 0.14 * curve * 0.65
          : 0.82 + 0.18 * curve * 0.65;

        const isCardHovered = hoveredCardRef.current === i;
        const prevMix = hoverMixRefs.current[i] ?? 0;
        const mix = prevMix + ((isCardHovered ? 1 : 0) - prevMix) * lerpAlpha;
        hoverMixRefs.current[i] = mix;

        const scale = baseScale * (1 + 0.055 * mix);
        const zConcave = (1 - Math.cos(clampedAngle)) * (isMobile ? 210 : 280);
        const z = zConcave - (isMobile ? 70 : 115) + 34 * mix;
        const y = -6 * mix;

        // Smooth inward concave tilt (left faces right +deg, right faces left -deg)
        const angleDeg = (clampedAngle * 180) / Math.PI;
        const rotateY = Math.max(-36, Math.min(36, -angleDeg * 1.08));

        // Soft fade past outermost visible wings
        const fadeStart = visibleHalfSlots * 0.96;
        const opacity =
          absD <= fadeStart
            ? 1
            : Math.max(0, 1 - (absD - fadeStart) / 0.85);

        const isAnyHovered = hoveredCardRef.current !== null;
        const baseBrightness = 0.88 + Math.min(0.12, curve * 0.12);
        const brightness = isAnyHovered
          ? isCardHovered
            ? 1.08
            : baseBrightness * 0.84
          : baseBrightness;

        node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(
          isCardHovered ? 60 : Math.round(10 + curve * 26)
        );
        node.style.filter = `brightness(${brightness.toFixed(3)})`;
        node.style.pointerEvents = opacity < 0.12 ? 'none' : 'auto';
      }

      const centeredIdx = ((Math.round(offsetRef.current) % count) + count) % count;
      if (centeredIdx !== lastFocusedIdxRef.current) {
        lastFocusedIdxRef.current = centeredIdx;
        setFocusedIdx(centeredIdx);
      }
    },
    [count, prefersReduced]
  );

  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!isDraggingRef.current) {
        if (targetOffsetRef.current !== null) {
          const diff = targetOffsetRef.current - offsetRef.current;
          if (Math.abs(diff) < 0.002) {
            offsetRef.current = targetOffsetRef.current;
            targetOffsetRef.current = null;
          } else {
            const ease = prefersReduced ? 1 : 1 - Math.exp(-9.5 * dt);
            offsetRef.current += diff * ease;
          }
        } else if (Math.abs(velocityRef.current) > 0.0006) {
          offsetRef.current += velocityRef.current * dt * 60;
          velocityRef.current *= Math.pow(0.91, dt * 60);
        } else if (!isHoveredRef.current && !isPausedRef.current && !prefersReduced) {
          offsetRef.current += dt * 0.24;
        }
      }

      if (count > 0 && targetOffsetRef.current === null) {
        offsetRef.current = ((offsetRef.current % count) + count) % count;
      }

      layoutCards(dt);
      rafId = requestAnimationFrame(tick);
    };

    layoutCards(0.016);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [count, layoutCards, prefersReduced]);

  const stepBy = (delta: number) => {
    if (count === 0) return;
    velocityRef.current = 0;
    const base =
      targetOffsetRef.current !== null
        ? targetOffsetRef.current
        : Math.round(offsetRef.current);
    targetOffsetRef.current = base + delta;
  };

  const jumpToIndex = (idx: number) => {
    if (count === 0) return;
    velocityRef.current = 0;
    const currentNorm = ((offsetRef.current % count) + count) % count;
    let diff = idx - currentNorm;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    targetOffsetRef.current = offsetRef.current + diff;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-arc-control="true"]')) return;
    isDraggingRef.current = true;
    targetOffsetRef.current = null;
    dragLastXRef.current = e.clientX;
    dragMovedRef.current = 0;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragLastXRef.current;
    dragLastXRef.current = e.clientX;
    dragMovedRef.current += Math.abs(dx);

    const sensitivity = widthRef.current < 640 ? 0.0058 : 0.0042;
    offsetRef.current -= dx * sensitivity;
    velocityRef.current = -dx * sensitivity * 0.44;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleStageKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepBy(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepBy(1);
    }
  };

  const activeIdx = hoveredIdx ?? focusedIdx;
  const activeWork = items[activeIdx] ?? items[0];

  return (
    <div
      aria-label="3D concave campaign poster showcase"
      className="relative overflow-hidden border-y border-[#C4B5FD]/15 bg-gradient-to-b from-[#11002B] via-[#1B0044] to-[#260058] py-8 select-none sm:py-11 md:py-14"
    >
      {/* Ambient Horizon Glow Behind Concave Curve */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-52 w-[86%] -translate-y-1/2 rounded-full bg-[#8B5CF6]/20 blur-[95px] sm:h-64 md:w-[68%]"
      />

      {/* Editorial Header Strip */}
      <div className="relative z-20 mx-auto mb-3 flex max-w-[1440px] items-center justify-between gap-4 px-4 sm:mb-5 sm:px-6 md:px-10">
        <div className="flex items-center gap-3">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.26em] text-[#C4B5FD] sm:text-xs">
            Campaign Archive Reel
          </span>
          <span aria-hidden="true" className="hidden h-px w-8 bg-[#C4B5FD]/35 sm:inline-block" />
          <span className="font-mono text-[11px] tabular-nums text-[#E9D5FF]/70 sm:text-xs">
            {String(count).padStart(2, '0')} Posters
          </span>
        </div>

        <span className="hidden text-[11px] font-medium text-[#C4B5FD]/75 sm:inline">
          Drag, hover or tap any poster to inspect
        </span>
      </div>

      {/* 3D Cylindrical Concave Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          isDraggingRef.current = false;
          isHoveredRef.current = false;
          hoveredCardRef.current = null;
          setHoveredIdx(null);
        }}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          hoveredCardRef.current = null;
          setHoveredIdx(null);
        }}
        style={{ perspective: '1120px' }}
        className="filmstrip-mask relative flex h-[248px] w-full cursor-grab touch-pan-y items-center justify-center overflow-hidden focus-visible:outline-none active:cursor-grabbing sm:h-[304px] md:h-[364px]"
      >
        {/* Subtle Edge Depth Vignettes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-[#160037] via-[#160037]/55 to-transparent sm:w-16 md:w-24"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-[#160037] via-[#160037]/55 to-transparent sm:w-16 md:w-24"
        />

        <div
          style={{ transformStyle: 'preserve-3d' }}
          className="relative flex h-full w-full items-center justify-center"
        >
          {items.map((work, idx) => (
            <button
              key={work.title}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              type="button"
              data-cursor="Inspect"
              aria-label={`Inspect ${work.title}`}
              onMouseEnter={() => {
                hoveredCardRef.current = idx;
                setHoveredIdx(idx);
              }}
              onMouseLeave={() => {
                if (hoveredCardRef.current === idx) {
                  hoveredCardRef.current = null;
                  setHoveredIdx(null);
                }
              }}
              onFocus={() => {
                hoveredCardRef.current = idx;
                setHoveredIdx(idx);
              }}
              onBlur={() => {
                if (hoveredCardRef.current === idx) {
                  hoveredCardRef.current = null;
                  setHoveredIdx(null);
                }
              }}
              onClick={() => {
                if (dragMovedRef.current > 8) return;
                onSelectWork?.(work);
              }}
              style={{ willChange: 'transform, opacity' }}
              className="group absolute left-1/2 top-1/2 -ml-[82px] -mt-[95px] h-[190px] w-[164px] overflow-hidden rounded-2xl border border-[#C4B5FD]/25 bg-[#150033] text-left shadow-[0_24px_56px_rgba(5,0,18,0.68)] transition-[border-color,box-shadow] duration-300 hover:border-[#C4B5FD]/85 hover:shadow-[0_28px_64px_rgba(139,92,246,0.36)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD] sm:-ml-[100px] sm:-mt-[116px] sm:h-[232px] sm:w-[200px] md:-ml-[120px] md:-mt-[139px] md:h-[278px] md:w-[240px]"
            >
              <ResilientImage
                src={work.images[0]}
                alt={`${work.title} — ${work.client}`}
                loading="eager"
                fallbackTitle={work.title}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />

              {/* Subtle Specular Sheen on Hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12002B]/90 via-[#12002B]/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-2.5 flex h-7 w-7 -translate-y-1 items-center justify-center rounded-full border border-white/25 bg-[#2A0063]/80 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:right-3 sm:top-3 sm:h-8 sm:w-8"
              >
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>

              <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <div className="truncate font-display text-[11px] font-bold uppercase tracking-wider text-white sm:text-xs">
                  {work.title}
                </div>
                <div className="mt-0.5 truncate text-[10px] font-medium text-[#C4B5FD] sm:text-[11px]">
                  {work.cat} · {work.year}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Dock: Active Spotlight + Index Track + Responsive Controls */}
      <div className="relative z-20 mx-auto mt-3 flex max-w-[1440px] flex-col gap-3.5 px-4 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-10">
        {activeWork && (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-[#C4B5FD]">
              {String(activeIdx + 1).padStart(2, '0')} /{' '}
              {String(count).padStart(2, '0')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-xs font-bold text-white sm:text-sm">
                {activeWork.title}
              </div>
              <div className="truncate text-[11px] font-medium text-[#C4B5FD]/80">
                {activeWork.client} · {activeWork.cat}
              </div>
            </div>
            <button
              type="button"
              data-arc-control="true"
              onClick={() => onSelectWork?.(activeWork)}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-[#C4B5FD] transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C4B5FD]"
            >
              <span>Inspect</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Interactive Selector Segments (Desktop) */}
        <div
          className="hidden items-center gap-1 lg:flex"
          role="tablist"
          aria-label="Select campaign poster"
          data-arc-control="true"
        >
          {items.map((item, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Focus ${item.title}`}
                onClick={() => jumpToIndex(idx)}
                className="flex h-8 items-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C4B5FD]"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    active
                      ? 'w-7 bg-[#C4B5FD] shadow-[0_0_12px_rgba(196,181,253,0.6)]'
                      : 'w-2.5 bg-white/25 hover:bg-white/50'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Transport Controls */}
        <div
          className="flex items-center justify-between gap-2 sm:justify-end"
          data-arc-control="true"
        >
          {/* Compact Mobile Progress Indicators */}
          <div className="flex items-center gap-1.5 sm:hidden" aria-hidden="true">
            {items.map((item, idx) => (
              <span
                key={item.title}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIdx ? 'w-5 bg-[#C4B5FD]' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              data-arc-control="true"
              onClick={() => stepBy(-1)}
              aria-label="Previous poster"
              className="footer-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              data-arc-control="true"
              onClick={() => setIsPaused((p) => !p)}
              aria-label={isPaused ? 'Resume showcase motion' : 'Pause showcase motion'}
              className="footer-glass-pill inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold uppercase tracking-wider"
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Play</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              )}
            </button>
            <button
              type="button"
              data-arc-control="true"
              onClick={() => stepBy(1)}
              aria-label="Next poster"
              className="footer-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
