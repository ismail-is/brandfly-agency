import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BRAND_LOGOS } from '../data/agencyData';

export type BrandStageMode = 'particles' | 'blueprint' | 'solid';

interface BrandParticleStageProps {
  activeAnatomy?: number; // 0 = Solid B, 1 = Negative F, 2 = The Opening
  activePillar?: number | null; // 0 = Create, 1 = Connect, 2 = Grow
  mode?: BrandStageMode;
  swatchBg?: string;
  compact?: boolean;
  onAnatomySelect?: (idx: number) => void;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  phase: number;
  color: string;
  isEdge: boolean;
  zone: 'b' | 'f-border' | 'opening' | 'f-void';
  nx: number; // normalized [0..1] inside icon bounds
  ny: number;
}

const VIOLET_PALETTE = [
  '#FFFFFF',
  '#F5F3FF',
  '#E9D5FF',
  '#C4B5FD',
  '#A78BFA',
  '#8B5CF6',
  '#7C3AED',
];

function classifyZone(nx: number, ny: number, isVoid: boolean): Particle['zone'] {
  if (isVoid) {
    // Inside the negative-space F channel
    if (nx > 0.72 && ny >= 0.25 && ny <= 0.44) return 'opening';
    return 'f-void';
  }
  // Upper-right F breakthrough channel rims
  if (nx > 0.62 && ny >= 0.14 && ny <= 0.50) return 'opening';
  // Inner walls adjacent to the F cut
  if (nx >= 0.24 && nx <= 0.76 && ny >= 0.22 && ny <= 0.78) return 'f-border';
  return 'b';
}

export const BrandParticleStage: React.FC<BrandParticleStageProps> = ({
  activeAnatomy = 0,
  activePillar = null,
  mode = 'particles',
  swatchBg = 'bg-[#090114]',
  compact = false,
  onAnatomySelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeAnatomyRef = useRef(activeAnatomy);
  const activePillarRef = useRef(activePillar);
  const modeRef = useRef(mode);

  const [imageReady, setImageReady] = useState(false);
  const [pulseSeed, setPulseSeed] = useState(0);

  activeAnatomyRef.current = activeAnatomy;
  activePillarRef.current = activePillar;
  modeRef.current = mode;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let isVisible = true;
    const pointer = { x: -9999, y: -9999, active: false };
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = BRAND_LOGOS.icon;

    const buildParticles = () => {
      if (!img.complete || img.naturalWidth === 0 || width <= 0 || height <= 0) return;

      const sampleSize = 180;
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleSize;
      offscreen.height = sampleSize;
      const octx = offscreen.getContext('2d');
      if (!octx) return;

      octx.clearRect(0, 0, sampleSize, sampleSize);
      octx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const data = octx.getImageData(0, 0, sampleSize, sampleSize).data;

      // Find tight bounding box of the monogram inside the image
      let minX = sampleSize;
      let maxX = 0;
      let minY = sampleSize;
      let maxY = 0;
      for (let y = 0; y < sampleSize; y++) {
        for (let x = 0; x < sampleSize; x++) {
          const alpha = data[(y * sampleSize + x) * 4 + 3];
          if (alpha > 110) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const bboxW = Math.max(1, maxX - minX);
      const bboxH = Math.max(1, maxY - minY);

      // Fit monogram comfortably in the center of the stage
      const targetDim = Math.min(width, height) * (compact ? 0.66 : 0.62);
      const scale = targetDim / Math.max(bboxW, bboxH);
      const drawW = bboxW * scale;
      const drawH = bboxH * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = (height - drawH) / 2;

      const step = compact ? 3 : 2.6;
      const nextParticles: Particle[] = [];

      const isOpaque = (sx: number, sy: number) => {
        const ix = Math.round(sx);
        const iy = Math.round(sy);
        if (ix < 0 || ix >= sampleSize || iy < 0 || iy >= sampleSize) return false;
        return data[(iy * sampleSize + ix) * 4 + 3] > 120;
      };

      for (let sy = minY; sy <= maxY; sy += step) {
        for (let sx = minX; sx <= maxX; sx += step) {
          const nx = (sx - minX) / bboxW;
          const ny = (sy - minY) / bboxH;
          const solid = isOpaque(sx, sy);

          // Sample edge proximity to sharpen geometric chamfer edges
          const isEdge =
            solid &&
            (!isOpaque(sx - 2, sy) ||
              !isOpaque(sx + 2, sy) ||
              !isOpaque(sx, sy - 2) ||
              !isOpaque(sx, sy + 2));

          // Also include sparse negative-space particles inside the F cut so Mode 02 can illuminate it
          const insideFCut =
            !solid && nx > 0.25 && nx < 0.94 && ny > 0.24 && ny < 0.77;

          if (!solid && !insideFCut) continue;
          if (!solid && Math.random() > 0.36) continue;
          if (solid && !isEdge && Math.random() > 0.62) continue;

          const jx = (Math.random() - 0.5) * step * scale * 0.85;
          const jy = (Math.random() - 0.5) * step * scale * 0.85;
          const tx = offsetX + nx * drawW + jx;
          const ty = offsetY + ny * drawH + jy;

          const spreadAngle = Math.random() * Math.PI * 2;
          const spreadDist = 80 + Math.random() * 140;

          const color =
            isEdge && Math.random() > 0.45
              ? VIOLET_PALETTE[Math.floor(Math.random() * 3)]
              : VIOLET_PALETTE[2 + Math.floor(Math.random() * (VIOLET_PALETTE.length - 2))];

          nextParticles.push({
            x: prefersReduced ? tx : tx + Math.cos(spreadAngle) * spreadDist,
            y: prefersReduced ? ty : ty + Math.sin(spreadAngle) * spreadDist,
            tx,
            ty,
            vx: 0,
            vy: 0,
            size: isEdge ? 1.35 + Math.random() * 1.15 : 1.05 + Math.random() * 1.45,
            baseAlpha: !solid ? 0.08 : isEdge ? 0.92 : 0.45 + Math.random() * 0.45,
            phase: Math.random() * Math.PI * 2,
            color,
            isEdge,
            zone: classifyZone(nx, ny, !solid),
            nx,
            ny,
          });
        }
      }

      particles = nextParticles;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const handleImgLoad = () => {
      if (destroyed) return;
      setImageReady(true);
      resize();
      if (prefersReduced) {
        renderFrame(0);
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      handleImgLoad();
    } else {
      img.onload = handleImgLoad;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const renderFrame = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      if (particles.length === 0) return;

      const t = timeMs * 0.001;
      const anatomy = activeAnatomyRef.current;
      const pillar = activePillarRef.current;
      const currentMode = modeRef.current;

      // Subtle atmospheric aura pulsing directly behind the particle monogram
      const glowRadius = Math.min(width, height) * 0.46;
      const pulse = prefersReduced ? 1 : 0.94 + Math.sin(t * 1.4) * 0.06;
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        glowRadius * 0.08,
        width * 0.5,
        height * 0.5,
        glowRadius * pulse
      );
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.34)');
      grad.addColorStop(0.5, 'rgba(75, 11, 170, 0.16)');
      grad.addColorStop(1, 'rgba(9, 1, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const modeAlphaBoost = currentMode === 'solid' ? 0.18 : currentMode === 'blueprint' ? 0.55 : 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Idle cosmic micro-drift so the monogram feels alive like floating stardust
        const floatAmp = prefersReduced ? 0 : p.isEdge ? 1.15 : 2.1;
        const driftX = prefersReduced ? 0 : Math.cos(t * 1.35 + p.phase) * floatAmp;
        const driftY = prefersReduced ? 0 : Math.sin(t * 1.15 + p.phase * 1.3) * floatAmp;

        // Directional flow when anatomy = 2 ("The Opening") or pillar = 1 ("Connect")
        let openingFlowX = 0;
        if (!prefersReduced && (anatomy === 2 || pillar === 1) && p.zone === 'opening') {
          openingFlowX = Math.max(0, Math.sin(t * 2.2 - p.nx * 5 + p.phase * 0.3)) * 8;
        }

        const targetX = p.tx + driftX + openingFlowX;
        const targetY = p.ty + driftY;

        if (!prefersReduced) {
          // Cursor magnetic repulsion
          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const distSq = dx * dx + dy * dy;
            const radius = 88;
            if (distSq < radius * radius && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = ((radius - dist) / radius) * 6.8;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          // Spring back to monogram target
          p.vx += (targetX - p.x) * 0.085;
          p.vy += (targetY - p.y) * 0.085;
          p.vx *= 0.80;
          p.vy *= 0.80;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          p.x = targetX;
          p.y = targetY;
        }

        // Compute zone-aware luminance
        let alpha = p.baseAlpha;
        if (p.zone === 'f-void') {
          // Illuminate the negative-space F channel when Anatomy 01 ("The F in Negative Space") is active
          alpha = anatomy === 1 ? 0.68 : 0.04;
        } else if (anatomy === 1 && p.zone === 'b') {
          alpha *= 0.52;
        } else if (anatomy === 2 && p.zone === 'opening') {
          alpha = Math.min(1, alpha * 1.25);
        } else if (anatomy === 0 && p.zone === 'b') {
          alpha = Math.min(1, alpha * 1.15);
        }

        if (pillar !== null) {
          if (pillar === 0 && p.zone === 'b') alpha = Math.min(1, alpha * 1.22);
          if (pillar === 1 && p.zone === 'opening') alpha = Math.min(1, alpha * 1.3);
          if (pillar === 2) alpha = Math.min(1, alpha * 1.12);
        }

        const shimmer = prefersReduced ? 1 : 0.72 + Math.sin(t * 2.4 + p.phase) * 0.28;
        ctx.globalAlpha = Math.max(0.02, Math.min(1, alpha * shimmer * modeAlphaBoost));
        ctx.fillStyle = p.zone === 'f-void' && anatomy === 1 ? '#C4B5FD' : p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (destroyed) return;
      if (isVisible && !prefersReduced) {
        renderFrame(now);
      }
      rafId = requestAnimationFrame(loop);
    };

    if (!prefersReduced) {
      rafId = requestAnimationFrame(loop);
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [compact, pulseSeed]);

  const handleScatterImpulse = () => {
    setPulseSeed((s) => s + 1);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleScatterImpulse}
      role="img"
      aria-label="Interactive BRANDFIY B+F particle monogram and geometric anatomy visual"
      className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl border border-[#C4B5FD]/25 transition-colors duration-300 ${swatchBg} ${
        compact ? 'aspect-square max-h-[360px]' : 'h-[340px] sm:h-[400px] lg:h-[440px]'
      }`}
    >
      {/* Subtle architectural blueprint grid fading softly at the perimeter */}
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_35%,transparent_100%)]"
      />

      {/* Crisp Solid Mark overlay when mode === 'solid' or fallback while image decodes */}
      {(!imageReady || mode === 'solid') && (
        <motion.img
          key={`solid-${activeAnatomy}`}
          initial={{ scale: 0.94, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          src={BRAND_LOGOS.icon}
          alt="BRANDFIY Monogram"
          className="relative z-10 h-36 w-36 object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.45)] md:h-48 md:w-48"
        />
      )}

      {/* Real-time Particle Monogram Canvas */}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ${
          mode === 'solid' ? 'opacity-20' : 'opacity-100'
        }`}
      />

      {/* Architectural Geometric Callouts Overlay (active in Blueprint mode or synchronized with anatomy selection) */}
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 h-full w-full transition-opacity duration-300 ${
          mode === 'blueprint' ? 'opacity-95' : 'opacity-60 group-hover:opacity-90'
        }`}
      >
        {/* Outer construction guide frame */}
        <rect
          x="76"
          y="76"
          width="248"
          height="248"
          fill="none"
          stroke="rgba(196,181,253,0.16)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Part 01 Highlight: Top-Right & Bottom-Right 45° Chamfer Guides */}
        <g
          className={`transition-opacity duration-300 ${
            activeAnatomy === 0 || mode === 'blueprint' ? 'opacity-100' : 'opacity-20'
          }`}
        >
          <line
            x1="258"
            y1="66"
            x2="334"
            y2="142"
            stroke="#C4B5FD"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
          <line
            x1="258"
            y1="334"
            x2="334"
            y2="258"
            stroke="#C4B5FD"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
          <text
            x="294"
            y="70"
            fill="#E9D5FF"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="600"
          >
            45° CUT
          </text>
        </g>

        {/* Part 02 Highlight: Negative-Space F Geometry Callout */}
        <g
          className={`transition-opacity duration-300 ${
            activeAnatomy === 1 || mode === 'blueprint' ? 'opacity-100' : 'opacity-20'
          }`}
        >
          <line
            x1="150"
            y1="142"
            x2="150"
            y2="274"
            stroke="#8B5CF6"
            strokeWidth="1.5"
          />
          <line
            x1="150"
            y1="142"
            x2="314"
            y2="142"
            stroke="#8B5CF6"
            strokeWidth="1.5"
          />
          <line
            x1="150"
            y1="208"
            x2="256"
            y2="208"
            stroke="#8B5CF6"
            strokeWidth="1.5"
          />
          <text
            x="84"
            y="210"
            fill="#C4B5FD"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="600"
          >
            24 U
          </text>
        </g>

        {/* Part 03 Highlight: Open Top-Right Breakthrough Rays */}
        <g
          className={`transition-opacity duration-300 ${
            activeAnatomy === 2 || mode === 'blueprint' ? 'opacity-100' : 'opacity-20'
          }`}
        >
          <line
            x1="234"
            y1="142"
            x2="354"
            y2="142"
            stroke="#E9D5FF"
            strokeWidth="1.4"
            strokeDasharray="4 3"
          />
          <polygon points="354,138 363,142 354,146" fill="#E9D5FF" />
          <text
            x="312"
            y="131"
            fill="#FFFFFF"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="700"
          >
            OPEN
          </text>
        </g>
      </svg>

      {/* Bottom Interactive Micro-Bar: Quick Anatomy Step Indicators */}
      {onAnatomySelect && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-4 bottom-4 z-30 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/12 bg-[#0D021D]/80 px-3 py-1.5 backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {['01 Solid B', '02 Cut F', '03 Opening'].map((label, idx) => {
              const selected = activeAnatomy === idx;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onAnatomySelect(idx)}
                  className={`min-h-[40px] whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition duration-150 ${
                    selected
                      ? 'bg-[#8B5CF6] text-white shadow-[0_0_16px_rgba(139,92,246,0.45)]'
                      : 'text-[#C4B5FD]/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleScatterImpulse}
            className="min-h-[40px] whitespace-nowrap rounded-xl px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#C4B5FD] transition hover:bg-white/10 hover:text-white"
          >
            Reform
          </button>
        </div>
      )}
    </div>
  );
};
