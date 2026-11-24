import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 360, mass: 0.4 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = (e.target as HTMLElement | null)?.closest('[data-cursor]');
      const nextLabel = target?.getAttribute('data-cursor') || null;
      setLabel(nextLabel);
    };

    const handleLeave = () => {
      setVisible(false);
      setLabel(null);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <motion.div
      style={{ x, y }}
      className="pointer-events-none fixed left-0 top-0 z-[120] hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      aria-hidden="true"
    >
      <motion.div
        animate={{
          scale: label ? 1 : 0.42,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-center rounded-full font-display text-[10px] font-bold uppercase tracking-wider transition-colors duration-150 ${
          label
            ? 'h-16 w-16 border border-[#C4B5FD]/60 bg-[#4B0BAA] text-white shadow-[0_8px_30px_rgba(139,92,246,0.5)]'
            : 'h-7 w-7 border border-[#8B5CF6] bg-[#8B5CF6]/25 text-transparent backdrop-blur-sm'
        }`}
      >
        {label || ''}
      </motion.div>
    </motion.div>
  );
};
