import React from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface ScrollDownIndicatorProps {
  ready?: boolean;
  href?: string;
  label?: string;
  scrollYProgress?: MotionValue<number>;
  className?: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({
  ready = true,
  href = '#services',
  label = 'Scroll Down',
  scrollYProgress,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const staticProgress = useMotionValue(0);
  const scrollOpacity = useTransform(
    scrollYProgress ?? staticProgress,
    [0, 0.18],
    [1, 0],
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <motion.div
      style={scrollYProgress ? { opacity: scrollOpacity } : undefined}
      className={`relative z-20 flex justify-center pb-5 pt-2 ${className}`}
    >
      <motion.a
        href={href}
        onClick={handleClick}
        data-cursor="Scroll"
        aria-label={`${label} to explore`}
        initial={{ opacity: 0, y: 10 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{
          duration: 0.7,
          delay: 0.56,
          ease: EASE_OUT_EXPO,
        }}
        className="group inline-flex min-h-[44px] flex-col items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[#31006B]/80 transition-colors duration-200 hover:text-[#4B0BAA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA]"
      >
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.26em] transition-colors">
          {label}
        </span>

        <motion.span
          aria-hidden="true"
          animate={
            prefersReduced
              ? undefined
              : {
                  y: [0, 5, 0],
                }
          }
          transition={{
            duration: 2.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center"
        >
          <span className="h-3.5 w-px bg-gradient-to-b from-[#4B0BAA]/25 via-[#4B0BAA]/75 to-[#4B0BAA] transition-all duration-200 group-hover:h-4" />
          <ChevronDown className="-mt-1.5 h-3.5 w-3.5 stroke-[2.25] text-[#4B0BAA] transition-transform duration-200 group-hover:translate-y-0.5" />
        </motion.span>
      </motion.a>
    </motion.div>
  );
};
