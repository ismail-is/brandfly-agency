import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRAND_LOGOS } from '../data/agencyData';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDismissed(true);
      onComplete?.();
      return;
    }

    const start = performance.now();
    const duration = 420;
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDismissed(true);
          onComplete?.();
        }, 80);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[130] flex flex-col justify-between bg-[#31006B] px-6 py-8 text-white md:px-12 md:py-12"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#C4B5FD]">
            <span>BRANDFIY</span>
            <span>Create · Connect · Grow</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            <motion.img
              src={BRAND_LOGOS.stacked}
              alt="Brandfiy Logo"
              initial={{ scale: 0.92, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-28 w-auto object-contain md:h-36"
            />
          </div>

          <div className="flex items-end justify-between border-t border-white/15 pt-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C4B5FD]">
              Loading experience
            </span>
            <span className="font-display text-3xl font-black tabular-nums text-[#E9D5FF] md:text-5xl">
              {String(progress).padStart(2, '0')}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
