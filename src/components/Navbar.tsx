import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Websites', href: '#web' },
  { label: 'Studio', href: '#studio' },
  { label: 'FAQ', href: '#faq' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'px-3 pt-2.5 md:px-6 md:pt-3' : 'px-3 pt-3.5 md:px-8 md:pt-5'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] items-center justify-between gap-6 rounded-full border px-4 py-2.5 backdrop-blur-md transition-all duration-300 md:px-7 md:py-3 ${
            scrolled
              ? 'border-[#C4B5FD]/60 bg-white/95 shadow-[0_14px_40px_rgba(49,0,107,0.14)]'
              : 'border-[#E9D5FF] bg-white/90 shadow-[0_10px_32px_rgba(49,0,107,0.08)]'
          }`}
        >
          {/* Zone 1: Brandfiy Badge + Wordmark */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA]"
            aria-label="Brandfiy home"
          >
            <BrandMark withBadge className="h-8 w-8 rounded-xl md:h-9 md:w-9" />
            <span className="font-display text-sm font-black uppercase tracking-tight text-[#0F172A] md:text-base">
              BRANDFIY
            </span>
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative shrink-0 whitespace-nowrap py-1 text-sm font-medium text-[#64748B] transition-colors duration-150 hover:text-[#0F172A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA]"
              >
                <span>{link.label}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#4B0BAA] transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary CTA + Mobile drawer toggle */}
          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href="#contact"
              data-cursor="Let's go"
              className="hidden shrink-0 whitespace-nowrap rounded-full bg-gradient-to-r from-[#4B0BAA] to-[#8B5CF6] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white shadow-[0_8px_20px_rgba(75,11,170,0.28)] transition duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4B0BAA] md:inline-flex"
            >
              Contact Us
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9D5FF] bg-[#F8FAFC] text-[#0F172A] transition hover:border-[#8B5CF6] hover:bg-[#E9D5FF]/50 md:hidden"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#31006B] px-6 pb-10 pt-24 text-white md:hidden"
          >
            <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline justify-between border-b border-white/15 py-4 font-display text-2xl font-black uppercase tracking-tight text-white transition hover:text-[#C4B5FD]"
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-semibold tabular-nums text-[#C4B5FD]">
                    0{idx + 1}
                  </span>
                </a>
              ))}
            </nav>

            <div className="space-y-4">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-[#4B0BAA] border border-[#8B5CF6] px-6 py-4 font-display text-sm font-black uppercase tracking-wider text-white transition hover:bg-[#8B5CF6]"
              >
                Start a project
              </a>
              <p className="text-center text-xs uppercase tracking-[0.25em] text-[#C4B5FD]">
                Create · Connect · Grow
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
