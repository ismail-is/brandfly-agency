import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const LETTERS = 'BRANDFIY'.split('');

interface AmbientDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  phase: number;
  color: string;
}

const DUST_COLORS = ['#C4B5FD', '#E9D5FF', '#8B5CF6', '#FFFFFF'];

export const FooterWordmarkParticles: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const [inView, setInView] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Subtle ambient stardust sparks floating cleanly behind crisp Unbounded typography
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let destroyed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = false;
    let dust: AmbientDust[] = [];

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const createDust = () => {
      const count = width < 640 ? 28 : 54;
      const items: AmbientDust[] = [];
      for (let i = 0; i < count; i++) {
        items.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -0.14 - Math.random() * 0.24,
          r: 0.9 + Math.random() * 1.4,
          alpha: 0.22 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          color: DUST_COLORS[i % DUST_COLORS.length],
        });
      }
      dust = items;
    };

    const draw = (timeMs: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = timeMs * 0.001;
      const p = pointerRef.current;

      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        if (!prefersReduced) {
          d.x += d.vx + Math.sin(t * 0.8 + d.phase) * 0.14;
          d.y += d.vy;

          if (p.active) {
            const dx = d.x - p.x;
            const dy = d.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 110 && dist > 1) {
              const push = ((110 - dist) / 110) * 0.9;
              d.x += (dx / dist) * push;
              d.y += (dy / dist) * push;
            }
          }

          if (d.y < -6) {
            d.y = height + 6;
            d.x = Math.random() * width;
          }
          if (d.x < -6) d.x = width + 6;
          if (d.x > width + 6) d.x = -6;
        }

        const twinkle = prefersReduced ? 1 : 0.6 + Math.sin(t * 2.1 + d.phase) * 0.4;
        ctx.globalAlpha = d.alpha * twinkle;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createDust();
      if (prefersReduced) draw(0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visible = entry?.isIntersecting ?? false;
        if (visible) setInView(true);
      },
      { threshold: 0.1 }
    );
    io.observe(stage);

    const loop = (now: number) => {
      if (destroyed) return;
      if (visible && !prefersReduced) {
        draw(now);
      }
      rafId = requestAnimationFrame(loop);
    };

    if (!prefersReduced) {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    pointerRef.current = { x, y, active: true };
    if (spotRef.current) {
      const px = ((x / rect.width) * 100).toFixed(1);
      const py = ((y / rect.height) * 100).toFixed(1);
      spotRef.current.style.opacity = '1';
      spotRef.current.style.background = `radial-gradient(320px circle at ${px}% ${py}%, rgba(167, 139, 250, 0.22), rgba(139, 92, 246, 0.08) 45%, transparent 72%)`;
    }
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
    setHoveredIdx(null);
    if (spotRef.current) {
      spotRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex w-full touch-pan-y items-center justify-center overflow-hidden py-6 select-none sm:py-9 md:py-12"
      aria-label="BRANDFIY"
    >
      {/* Subtle Ambient Violet Stardust */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      {/* Pointer Interactive Radial Light */}
      <div
        ref={spotRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
      />

      {/* Crisp Monumental Unbounded Wordmark */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          aria-hidden="true"
          className="flex items-baseline justify-center font-display text-[clamp(2.55rem,11.4vw,10.6rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]"
        >
          {LETTERS.map((char, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <motion.span
                key={`${char}-${idx}`}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`footer-text-glow inline-block cursor-default bg-gradient-to-b from-white via-[#E9D5FF] to-[#A78BFA] bg-clip-text text-transparent transition-transform duration-200 ${
                  isHovered ? '-translate-y-1.5 scale-[1.04] brightness-125' : ''
                }`}
              >
                {char}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
