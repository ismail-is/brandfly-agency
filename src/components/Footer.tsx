import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';
import { AGENCY_CONTACT, buildWhatsAppUrl } from '../data/agencyData';
import { BrandMark } from './BrandMark';
import { FooterWordmarkParticles } from './FooterWordmarkParticles';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CAPABILITY_LINKS = [
  { label: 'Digital Marketing', href: '#services' },
  { label: 'Brand Strategy & Identity', href: '#services' },
  { label: 'Graphic Design', href: '#services' },
  { label: '4K Video Production', href: '#services' },
  { label: 'Social Media Management', href: '#services' },
  { label: 'Website Engineering', href: '#web' },
];

const EXPLORE_LINKS = [
  { label: 'Selected Work', href: '#work' },
  { label: 'Web Showcase', href: '#web' },
  { label: 'Logo & Studio', href: '#studio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Start a Brief', href: '#contact' },
];

const SOCIAL_CHANNELS = [
  {
    label: 'Instagram',
    handle: AGENCY_CONTACT.socialHandle,
    href: AGENCY_CONTACT.instagram,
    external: true,
  },
  {
    label: 'Facebook',
    handle: 'facebook.com/brandfiy.in',
    href: AGENCY_CONTACT.facebook,
    external: true,
  },
  {
    label: 'WhatsApp Studio',
    handle: AGENCY_CONTACT.phones[0].display,
    href: buildWhatsAppUrl(
      AGENCY_CONTACT.phones[0].raw,
      'Hi BRANDFIY! I would love to discuss a branding or marketing project.'
    ),
    external: true,
  },
  {
    label: 'Agency Website',
    handle: AGENCY_CONTACT.domain,
    href: '#top',
    external: false,
  },
];

function getStudioIstTime(): string {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  } catch {
    return 'IST';
  }
}

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [studioTime, setStudioTime] = useState<string>(() => getStudioIstTime());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStudioTime(getStudioIstTime());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const revealEls = footerRef.current?.querySelectorAll<HTMLElement>('[data-footer-reveal]');
      if (revealEls && revealEls.length > 0) {
        gsap.fromTo(
          revealEls,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 84%',
              once: true,
            },
          }
        );
      }
    });

    return () => mm.revert();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(AGENCY_CONTACT.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      window.location.href = `mailto:${AGENCY_CONTACT.email}`;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const primaryPhone = AGENCY_CONTACT.phones[0];

  return (
    <>
      <footer
        ref={footerRef}
        className="relative overflow-hidden border-t border-[#C4B5FD]/15 bg-gradient-to-b from-[#170036] via-[#240054] to-[#31006B] text-white"
      >
        {/* Ambient architectural grid & subtle studio aurora */}
        <div
          aria-hidden="true"
          className="grid-lines pointer-events-none absolute inset-0 opacity-45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(92vw,960px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.42)_0%,rgba(75,11,170,0.18)_48%,transparent_75%)] opacity-60 blur-[110px]"
        />

        <div className="relative z-10 mx-auto max-w-[1440px] px-5 pt-16 md:px-10 md:pt-24">
          {/* 1. Top Conversion & Brand Statement Row */}
          <div
            data-footer-reveal
            className="grid items-end gap-10 border-b border-white/12 pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-16"
          >
            <div className="lg:col-span-7">
              <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs font-bold uppercase tracking-[0.28em] text-[#C4B5FD]">
                <span>BRANDFIY Studio</span>
                <span aria-hidden="true">·</span>
                <span>Create · Connect · Grow</span>
              </div>

              <h2 className="footer-text-glow max-w-3xl font-display text-3xl font-black uppercase leading-[0.96] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                Ready to make every brand move count?
              </h2>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:col-span-5">
              <p className="max-w-md text-sm leading-relaxed text-[#E9D5FF]/85 md:text-base">
                Strategy, identity systems, campaign visuals, 4K brand films, social calendars,
                and custom web engineering — unified under one creative team.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#contact"
                  className="group inline-flex min-h-[48px] items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-7 py-3.5 font-display text-xs font-black uppercase tracking-wider text-[#31006B] shadow-[0_14px_34px_rgba(139,92,246,0.38)] transition duration-150 hover:-translate-y-0.5 hover:bg-[#E9D5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span>Start a Project Brief</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href={buildWhatsAppUrl(
                    primaryPhone.raw,
                    'Hi BRANDFIY! I would love to start a branding or marketing project.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill group inline-flex min-h-[48px] items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  <MessageCircle className="h-4 w-4 text-[#C4B5FD] transition-colors group-hover:text-white" />
                  <span>WhatsApp Studio</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Architectural Directory Grid */}
          <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-16">
            {/* Brand Anchor & Direct Lines */}
            <div data-footer-reveal className="space-y-6 lg:col-span-4">
              <a
                href="#top"
                aria-label="BRANDFIY home"
                className="group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4B5FD]"
              >
                <BrandMark
                  withBadge
                  className="h-10 w-10 rounded-xl transition-transform duration-200 group-hover:scale-105"
                />
                <div>
                  <span className="footer-text-glow block font-display text-lg font-black uppercase tracking-tight text-white">
                    BRANDFIY
                  </span>
                  <span className="block text-[11px] font-medium tracking-[0.2em] text-[#C4B5FD]/85">
                    CREATE · CONNECT · GROW
                  </span>
                </div>
              </a>

              <div className="space-y-2.5 border-t border-white/10 pt-5 text-sm text-[#E9D5FF]/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C4B5FD]" />
                  <div>
                    <div className="font-medium text-white">{AGENCY_CONTACT.location}</div>
                    <div className="mt-0.5 font-mono text-xs tabular-nums text-[#C4B5FD]/85">
                      Studio Local Time · {studioTime} IST
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean Direct Contact Rows */}
              <div className="space-y-3 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${AGENCY_CONTACT.email}`}
                    className="group inline-flex min-h-[40px] min-w-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#C4B5FD]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#C4B5FD]" />
                    <span className="truncate">{AGENCY_CONTACT.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy studio email address"
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 text-xs font-semibold text-[#E9D5FF] transition duration-150 hover:border-[#C4B5FD]/50 hover:bg-white/15 hover:text-white"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#C4B5FD]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-[#C4B5FD]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {AGENCY_CONTACT.phones.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:+${phone.raw}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 font-mono text-xs font-medium tabular-nums text-[#E9D5FF]/90 transition-colors hover:text-white"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-[#C4B5FD]" />
                      <span>{phone.display}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column: Capabilities */}
            <nav
              data-footer-reveal
              aria-label="Agency capabilities"
              className="lg:col-span-3"
            >
              <h3 className="footer-text-glow mb-5 font-display text-xs font-bold uppercase tracking-[0.26em] text-[#C4B5FD]">
                Capabilities
              </h3>
              <ul className="space-y-2">
                {CAPABILITY_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group relative inline-flex min-h-[36px] items-center gap-1.5 py-1 text-sm font-medium text-[#E9D5FF]/85 transition-colors duration-150 hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-[#C4B5FD] transition-transform duration-200 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column: Explore */}
            <nav data-footer-reveal aria-label="Site sections" className="lg:col-span-2">
              <h3 className="footer-text-glow mb-5 font-display text-xs font-bold uppercase tracking-[0.26em] text-[#C4B5FD]">
                Explore
              </h3>
              <ul className="space-y-2">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="group relative inline-flex min-h-[36px] items-center gap-1.5 py-1 text-sm font-medium text-[#E9D5FF]/85 transition-colors duration-150 hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span className="absolute inset-x-0 bottom-0.5 h-px origin-left scale-x-0 bg-[#C4B5FD] transition-transform duration-200 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Column: Connect & Social Channels */}
            <div data-footer-reveal className="lg:col-span-3">
              <h3 className="footer-text-glow mb-5 font-display text-xs font-bold uppercase tracking-[0.26em] text-[#C4B5FD]">
                Connect
              </h3>
              <ul className="divide-y divide-white/10 border-t border-white/10">
                {SOCIAL_CHANNELS.map((ch) => (
                  <li key={ch.label}>
                    <a
                      href={ch.href}
                      {...(ch.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="group flex min-h-[48px] items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-white"
                    >
                      <div className="min-w-0">
                        <span className="block font-semibold text-white transition-colors group-hover:text-[#C4B5FD]">
                          {ch.label}
                        </span>
                        <span className="block truncate text-xs text-[#C4B5FD]/80">
                          {ch.handle}
                        </span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#C4B5FD]/75 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Interactive Monumental BRANDFIY Signature Band */}
          <div className="border-t border-white/10">
            <FooterWordmarkParticles />
          </div>

          {/* 4. Grounded Legal & Back-to-Top Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#C4B5FD]/15 py-6 text-xs text-[#E9D5FF]/80 md:flex-row">
            <p className="text-center md:text-left">
              © {year} BRANDFIY Creative Agency · {AGENCY_CONTACT.location}
            </p>

            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C4B5FD]">
              <span>Create</span>
              <span aria-hidden="true">·</span>
              <span>Connect</span>
              <span aria-hidden="true">·</span>
              <span>Grow</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="footer-glass-pill group inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white"
            >
              <span>Back to top</span>
              <ArrowUp className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Subtle Floating WhatsApp Quick Action */}
      <a
        href={buildWhatsAppUrl(
          primaryPhone.raw,
          'Hi BRANDFIY! I would love to chat about a project.'
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with BRANDFIY on WhatsApp"
        className="footer-glass-pill group fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white md:bottom-7 md:right-7"
      >
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-full bg-[#31006B] px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
          Chat with us
        </span>
        <MessageCircle className="h-5 w-5" />
      </a>
    </>
  );
};
