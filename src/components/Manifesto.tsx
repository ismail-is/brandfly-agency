import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { BrandMark } from './BrandMark';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO_TEXT =
  'We are BRANDFIY — built to create, connect and grow. From Kerala to the world, we turn bold ideas into identities, films, posters and websites that make people stop scrolling and start noticing.';

const HIGHLIGHT_WORDS = new Set(['BRANDFIY', 'create,', 'connect', 'grow.', 'noticing.']);

interface WordProps {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const ManifestoWord: React.FC<WordProps> = ({ word, index, total, progress }) => {
  const start = (index / total) * 0.78;
  const end = Math.min(1, start + 0.16);
  const scrollOpacity = useTransform(progress, [start, end], [0.34, 1]);
  const isHighlight = HIGHLIGHT_WORDS.has(word);

  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.14em]">
      <span className="manifesto-word-inner inline-block">
        <motion.span
          style={{ opacity: scrollOpacity }}
          className={`relative inline-block ${
            isHighlight
              ? 'footer-text-glow footer-text-glow-light text-[#4B0BAA]'
              : 'text-[#0F172A]'
          }`}
        >
          {word}
          {isHighlight && (
            <span
              style={{ transformOrigin: 'left center' }}
              className="manifesto-underline absolute -bottom-0.5 left-0 h-[0.11em] w-full bg-[#8B5CF6]"
            />
          )}
        </motion.span>
      </span>
    </span>
  );
};

export const Manifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const words = MANIFESTO_TEXT.split(' ');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  const markScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.08, 1]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top 84%',
            once: true,
          },
        });

        tl.fromTo(
          '.manifesto-kicker',
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
          }
        )
          .fromTo(
            '.manifesto-word-inner',
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.62,
              stagger: 0.028,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
            },
            '-=0.34'
          )
          .fromTo(
            '.manifesto-underline',
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.48,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform',
            },
            '-=0.42'
          )
          .fromTo(
            '.manifesto-footer-item',
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.09,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
            },
            '-=0.28'
          );
      }, stage);

      return () => ctx.revert();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const ctx = gsap.context(() => {
        gsap.set(
          [
            '.manifesto-kicker',
            '.manifesto-word-inner',
            '.manifesto-underline',
            '.manifesto-footer-item',
          ],
          { clearProps: 'all', autoAlpha: 1, y: 0, scaleX: 1 }
        );
      }, stage);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F8FAFC] text-[#0F172A] md:min-h-[145vh]"
    >
      <div className="flex flex-col justify-center overflow-hidden px-5 py-20 md:sticky md:top-0 md:h-screen md:px-10 md:py-0">
        <div ref={stageRef} className="mx-auto w-full max-w-[1400px]">
          <div className="manifesto-kicker footer-text-glow footer-text-glow-light mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.32em] text-[#4B0BAA] md:mb-10">
            <motion.div style={{ scale: markScale }}>
              <BrandMark withBadge className="h-7 w-7" />
            </motion.div>
            <span>Manifesto</span>
          </div>

          <p className="flex flex-wrap gap-x-[0.28em] gap-y-[0.04em] font-display text-[6.8vw] font-semibold leading-[1.15] tracking-tight sm:text-[5.2vw] md:text-[3.9vw]">
            {words.map((word, idx) => (
              <ManifestoWord
                key={`${word}-${idx}`}
                word={word}
                index={idx}
                total={words.length}
                progress={scrollYProgress}
              />
            ))}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 md:mt-12">
            <div className="manifesto-footer-item flex items-center gap-3">
              <span className="h-px w-12 bg-[#4B0BAA]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#64748B]">
                Create · Connect · Grow
              </span>
            </div>

            <a
              href="#contact"
              className="manifesto-footer-item footer-glass-pill footer-glass-pill-light inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
