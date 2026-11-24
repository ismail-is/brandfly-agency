import { RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface UseGsapScrollRevealOptions {
  /** Base delay (in seconds) applied before scroll-triggered animations begin. */
  delay?: number;
  /** Default delay (in seconds) for `[data-gsap-heading]` blocks. Falls back to `delay`. */
  headingDelay?: number;
  /** Default delay (in seconds) for `[data-gsap-reveal]` containers. Falls back to `delay`. */
  revealDelay?: number;
  /** Default initial delay (in seconds) before `[data-gsap-stagger]` groups start staggering. Falls back to `delay`. */
  staggerDelay?: number;
  /** Default stagger interval (in seconds) between `[data-gsap-item]` children. */
  stagger?: number;
  /** Default stagger interval (in seconds) between children inside `[data-gsap-heading]`. */
  headingStagger?: number;
  /** Default animation duration (in seconds). */
  duration?: number;
  /** Default ScrollTrigger `start` threshold (e.g. `'top 88%'`). */
  start?: string;
}

function parseOptionalNumber(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/**
 * Unified GSAP ScrollTrigger choreography across all primary section headings
 * (`[data-gsap-heading]`), primary content containers (`[data-gsap-reveal]`),
 * and staggered card/item grids (`[data-gsap-stagger]` > `[data-gsap-item]`).
 *
 * Supports both hook-level timing options (`delay` / `UseGsapScrollRevealOptions`)
 * and per-element HTML data overrides (`data-gsap-delay`, `data-gsap-stagger-step`,
 * `data-gsap-duration`) so sections enter the viewport with varied pacing.
 *
 * Clears inline transforms upon completion so sticky sections and CSS/Motion
 * hover states continue working cleanly, and respects `prefers-reduced-motion`.
 */
export function useGsapScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  ready: boolean,
  delayOrOptions?: number | UseGsapScrollRevealOptions
) {
  const opts: UseGsapScrollRevealOptions =
    typeof delayOrOptions === 'number'
      ? { delay: delayOrOptions }
      : (delayOrOptions ?? {});

  const baseDelay = opts.delay ?? 0;
  const defaultHeadingDelay = opts.headingDelay ?? baseDelay;
  const defaultRevealDelay = opts.revealDelay ?? baseDelay;
  const defaultStaggerDelay = opts.staggerDelay ?? baseDelay;
  const defaultStagger = opts.stagger ?? 0.075;
  const defaultHeadingStagger = opts.headingStagger ?? 0.09;
  const defaultDuration = opts.duration;
  const defaultStart = opts.start ?? 'top 88%';
  const defaultRevealStart = opts.start ?? 'top 89%';

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Primary section headings (kicker + display headline + summary split)
      const headings = gsap.utils.toArray<HTMLElement>('[data-gsap-heading]', root);

      headings.forEach((heading) => {
        const targets =
          heading.children.length > 1
            ? (Array.from(heading.children) as HTMLElement[])
            : [heading];

        const headingDelay =
          parseOptionalNumber(heading.dataset.gsapDelay) ?? defaultHeadingDelay;
        const headingStaggerStep =
          parseOptionalNumber(heading.dataset.gsapStaggerStep) ?? defaultHeadingStagger;
        const headingDuration =
          parseOptionalNumber(heading.dataset.gsapDuration) ?? defaultDuration ?? 0.72;

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: headingDuration,
            delay: headingDelay,
            stagger: targets.length > 1 ? headingStaggerStep : 0,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: heading,
              start: defaultStart,
              once: true,
            },
          }
        );
      });

      // 2. Primary content containers & editorial stages
      const blocks = gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]', root);

      blocks.forEach((el) => {
        const revealDelay =
          parseOptionalNumber(el.dataset.gsapDelay) ?? defaultRevealDelay;
        const revealDuration =
          parseOptionalNumber(el.dataset.gsapDuration) ?? defaultDuration ?? 0.78;

        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: revealDuration,
            delay: revealDelay,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: el,
              start: defaultRevealStart,
              once: true,
            },
          }
        );
      });

      // 3. Staggered card grids & metric strips
      const staggerGroups = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-stagger]',
        root
      );

      staggerGroups.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>('[data-gsap-item]', group);
        if (items.length === 0) return;

        const groupDelay =
          parseOptionalNumber(group.dataset.gsapDelay) ?? defaultStaggerDelay;
        const groupStaggerStep =
          parseOptionalNumber(group.dataset.gsapStaggerStep) ?? defaultStagger;
        const groupDuration =
          parseOptionalNumber(group.dataset.gsapDuration) ?? defaultDuration ?? 0.68;

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: groupDuration,
            delay: groupDelay,
            stagger: (index, target) => {
              const itemExtraDelay =
                parseOptionalNumber((target as HTMLElement).dataset.gsapDelay) ?? 0;
              return index * groupStaggerStep + itemExtraDelay;
            },
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: group,
              start: defaultStart,
              once: true,
            },
          }
        );
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const targets = gsap.utils.toArray<HTMLElement>(
        '[data-gsap-heading], [data-gsap-heading] > *, [data-gsap-reveal], [data-gsap-item]',
        root
      );
      gsap.set(targets, { clearProps: 'all', autoAlpha: 1, y: 0 });
    });

    if (ready) {
      const raf = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return () => {
        window.cancelAnimationFrame(raf);
        mm.revert();
      };
    }

    return () => {
      mm.revert();
    };
  }, [
    containerRef,
    ready,
    baseDelay,
    defaultHeadingDelay,
    defaultRevealDelay,
    defaultStaggerDelay,
    defaultStagger,
    defaultHeadingStagger,
    defaultDuration,
    defaultStart,
  ]);
}
