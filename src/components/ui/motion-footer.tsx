"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUp,
  ArrowUpRight,
  Mail,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { AGENCY_CONTACT, buildWhatsAppUrl } from "../../data/agencyData";
import { BrandMark } from "../BrandMark";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. BRANDFIY-ADAPTIVE CINEMATIC FOOTER STYLES
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  background:
    radial-gradient(75% 65% at 50% 18%, rgba(139, 92, 246, 0.24) 0%, rgba(75, 11, 170, 0.14) 45%, transparent 75%),
    linear-gradient(180deg, #160033 0%, #260054 48%, #31006B 100%);
  color: #FFFFFF;

  --foreground: #FFFFFF;
  --background: #22004D;
  --primary: #8B5CF6;
  --secondary: #C4B5FD;
  --destructive: #FB7185;
  --muted-foreground: #D8C7FF;
  --border: rgba(196, 181, 253, 0.18);

  --pill-bg-1: rgba(255, 255, 255, 0.08);
  --pill-bg-2: rgba(196, 181, 253, 0.03);
  --pill-shadow: rgba(12, 0, 30, 0.45);
  --pill-highlight: rgba(233, 213, 255, 0.18);
  --pill-inset-shadow: rgba(22, 0, 52, 0.65);
  --pill-border: rgba(196, 181, 253, 0.22);

  --pill-bg-1-hover: rgba(139, 92, 246, 0.28);
  --pill-bg-2-hover: rgba(196, 181, 253, 0.12);
  --pill-border-hover: rgba(233, 213, 255, 0.48);
  --pill-shadow-hover: rgba(10, 0, 28, 0.65);
  --pill-highlight-hover: rgba(255, 255, 255, 0.28);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(1.12); opacity: 0.95; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(251, 113, 133, 0.5)); }
  15%, 45% { transform: scale(1.22); filter: drop-shadow(0 0 12px rgba(251, 113, 133, 0.85)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 38s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(196, 181, 253, 0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(196, 181, 253, 0.06) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(139, 92, 246, 0.34) 0%,
    rgba(75, 11, 170, 0.24) 42%,
    transparent 72%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, color 0.2s ease;
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 18px 36px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: #FFFFFF;
}

.footer-primary-pill {
  background: linear-gradient(135deg, #FFFFFF 0%, #E9D5FF 100%);
  color: #31006B;
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 16px 38px -10px rgba(139, 92, 246, 0.55);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, filter 0.2s ease;
}

.footer-primary-pill:hover {
  box-shadow: 0 22px 46px -8px rgba(196, 181, 253, 0.65);
  filter: brightness(1.03);
}

.footer-giant-bg-text {
  font-family: "Unbounded", system-ui, sans-serif;
  font-size: clamp(3.6rem, 15.2vw, 15.5rem);
  line-height: 0.82;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(196, 181, 253, 0.16);
  background: linear-gradient(180deg, rgba(233, 213, 255, 0.22) 0%, rgba(139, 92, 246, 0.06) 65%, transparent 98%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  font-family: "Unbounded", system-ui, sans-serif;
  background: linear-gradient(180deg, #FFFFFF 12%, #E9D5FF 65%, #C4B5FD 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 8px 28px rgba(139, 92, 246, 0.28));
}

@media (max-height: 700px) {
  .cinematic-footer-curtain {
    height: auto !important;
    min-height: 0 !important;
    clip-path: none !important;
  }
  .cinematic-footer-fixed {
    position: relative !important;
    height: auto !important;
    min-height: 620px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-footer-breathe,
  .animate-footer-scroll-marquee,
  .animate-footer-heartbeat {
    animation: none !important;
  }
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.28,
            y: y * 0.28,
            rotationX: -y * 0.1,
            rotationY: x * 0.1,
            scale: 1.03,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.35)",
            duration: 0.9,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as EventListener);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as EventListener);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN CINEMATIC FOOTER COMPONENT (TAILORED FOR BRANDFIY)
// -------------------------------------------------------------------------
const MARQUEE_PILLARS = [
  "Create · Connect · Grow",
  "Brand Strategy & Identity",
  "Digital Marketing · 4.8x ROAS",
  "4K Video Production",
  "Social Media Management",
  "Custom Web Development",
];

const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-5">
    {MARQUEE_PILLARS.map((item) => (
      <React.Fragment key={item}>
        <span className="whitespace-nowrap">{item}</span>
        <span className="text-[#8B5CF6]" aria-hidden="true">
          ✦
        </span>
      </React.Fragment>
    ))}
  </div>
);

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Selected Work", href: "#work" },
  { label: "Websites", href: "#web" },
  { label: "Logo & Studio", href: "#studio" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "6vh", scale: 0.92, opacity: 0.35 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 95%",
            end: "top 35%",
            scrub: 0.8,
          },
        },
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 36, opacity: 0.25 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 88%",
            end: "top 40%",
            scrub: 0.8,
          },
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const primaryPhone = AGENCY_CONTACT.phones[0];
  const secondaryPhone = AGENCY_CONTACT.phones[1];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Curtain Reveal Wrapper */}
      <div
        ref={wrapperRef}
        className="cinematic-footer-curtain relative w-full md:h-[92vh] md:min-h-[680px]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cinematic-footer-fixed cinematic-footer-wrapper relative flex w-full flex-col justify-between overflow-hidden md:fixed md:bottom-0 md:left-0 md:h-[92vh] md:min-h-[680px]">
          {/* Ambient Violet Aurora & Studio Grid */}
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[55vh] w-[82vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          {/* Giant BRANDFIY Bottom Wordmark Identity */}
          <div
            ref={giantTextRef}
            aria-hidden="true"
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[1.5vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
          >
            BRANDFIY
          </div>

          {/* 1. Diagonal Sleek Service Marquee */}
          <div className="relative z-10 mt-6 w-full -rotate-1 scale-105 overflow-hidden border-y border-[#C4B5FD]/20 bg-[#1B003F]/75 py-3.5 shadow-2xl backdrop-blur-md md:mt-8">
            <div className="flex w-max animate-footer-scroll-marquee text-[11px] font-bold uppercase tracking-[0.28em] text-[#E9D5FF]/85 md:text-xs">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Center Brand Anchor, Headline & Magnetic Actions */}
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-10 text-center md:px-10">
            <div ref={headingRef} className="flex flex-col items-center">
              <a
                href="#top"
                aria-label="BRANDFIY home"
                className="mb-5 inline-flex items-center gap-3 text-white transition-opacity hover:opacity-90"
              >
                <BrandMark className="h-8 w-8 rounded-lg bg-[#4B0BAA]/80 p-1.5 ring-1 ring-[#C4B5FD]/30" />
                <span className="font-display text-sm font-bold tracking-[0.2em] text-[#E9D5FF] md:text-base">
                  BRANDFIY
                </span>
              </a>

              <h2 className="footer-text-glow max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">
                Ready to grow your brand?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E9D5FF]/80 md:text-base">
                Strategy, brand identity, graphic design, 4K brand films, social media and
                custom websites crafted under one roof.
              </p>
            </div>

            {/* Interactive Magnetic Action Buttons & Navigation */}
            <div ref={linksRef} className="mt-8 flex w-full flex-col items-center gap-5">
              {/* Primary Conversion CTAs */}
              <div className="flex w-full flex-wrap items-center justify-center gap-3.5 md:gap-4">
                <MagneticButton
                  as="a"
                  href="#contact"
                  className="footer-primary-pill group flex items-center gap-2.5 whitespace-nowrap rounded-full px-7 py-3.5 text-sm font-bold md:px-9 md:py-4 md:text-base"
                >
                  <span>Start a Project Brief</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={buildWhatsAppUrl(
                    primaryPhone.raw,
                    "Hi BRANDFIY! I would love to start a branding or digital marketing project.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill group flex items-center gap-2.5 whitespace-nowrap rounded-full px-7 py-3.5 text-sm font-bold text-white md:px-8 md:py-4 md:text-base"
                >
                  <MessageCircle className="h-4 w-4 text-[#C4B5FD] transition-colors group-hover:text-white" />
                  <span>WhatsApp Studio</span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={`tel:+${primaryPhone.raw}`}
                  className="footer-glass-pill group flex items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3.5 text-sm font-semibold tabular-nums text-[#E9D5FF] md:py-4"
                >
                  <PhoneCall className="h-4 w-4 text-[#C4B5FD] transition-colors group-hover:text-white" />
                  <span>{primaryPhone.display}</span>
                </MagneticButton>
              </div>

              {/* Site Sections Navigation Row */}
              <nav
                aria-label="Footer navigation"
                className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-[#E9D5FF]/75 md:text-sm"
              >
                {NAV_LINKS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap py-1 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* Direct Contact & Social Pills */}
              <div className="flex w-full flex-wrap justify-center gap-2.5 md:gap-3">
                <MagneticButton
                  as="a"
                  href={AGENCY_CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium text-[#E9D5FF] hover:text-white"
                >
                  Instagram · {AGENCY_CONTACT.socialHandle}
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={AGENCY_CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium text-[#E9D5FF] hover:text-white"
                >
                  Facebook · Brandfiy
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={`mailto:${AGENCY_CONTACT.email}`}
                  className="footer-glass-pill flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium text-[#E9D5FF] hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 text-[#C4B5FD]" />
                  <span>{AGENCY_CONTACT.email}</span>
                </MagneticButton>

                {secondaryPhone && (
                  <MagneticButton
                    as="a"
                    href={`tel:+${secondaryPhone.raw}`}
                    className="footer-glass-pill whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-medium tabular-nums text-[#E9D5FF] hover:text-white"
                  >
                    {secondaryPhone.display}
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Brand Identity & Back-to-Top */}
          <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 border-t border-[#C4B5FD]/15 px-5 py-5 md:flex-row md:px-10 md:py-6">
            {/* Copyright */}
            <div className="order-2 text-center text-[11px] font-medium tracking-wider text-[#C4B5FD]/75 md:order-1 md:text-left md:text-xs">
              © {year} BRANDFIY Creative Agency · {AGENCY_CONTACT.location}
            </div>

            {/* Crafted by BRANDFIY Identity Pill */}
            <a
              href="#top"
              className="footer-glass-pill order-1 flex items-center gap-2 rounded-full px-5 py-2.5 text-xs md:order-2"
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E9D5FF]/80">
                Crafted with
              </span>
              <span className="animate-footer-heartbeat text-sm text-[#FB7185]" aria-hidden="true">
                ♥
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#E9D5FF]/80">
                by
              </span>
              <span className="font-display ml-0.5 text-xs font-bold tracking-wider text-white">
                BRANDFIY
              </span>
            </a>

            {/* Back to top */}
            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="footer-glass-pill group order-3 flex h-11 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold text-[#E9D5FF] hover:text-white"
            >
              <span>Top</span>
              <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
