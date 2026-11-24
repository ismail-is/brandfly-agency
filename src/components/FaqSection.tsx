import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  AGENCY_CONTACT,
  FAQS,
  buildWhatsAppUrl,
} from '../data/agencyData';
import { BrandMark } from './BrandMark';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FAQ_META = [
  { topic: 'Capabilities', actionLabel: 'Explore 9 Services', actionHref: '#services' },
  { topic: 'Brand Mark', actionLabel: 'Inspect Logo Anatomy', actionHref: '#studio' },
  { topic: 'Onboarding', actionLabel: 'Open Project Brief', actionHref: '#contact' },
  { topic: 'Timelines', actionLabel: 'View Selected Work', actionHref: '#work' },
  { topic: 'Full Funnel', actionLabel: 'Client Outcomes', actionHref: '#testimonials' },
  { topic: 'Global Studio', actionLabel: 'Start Consultation', actionHref: '#contact' },
];

export const FaqSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const list = FAQS.map((item, originalIndex) => ({
      ...item,
      originalIndex,
      meta: FAQ_META[originalIndex] ?? {
        topic: 'Studio',
        actionLabel: 'Contact Studio',
        actionHref: '#contact',
      },
    }));
    if (!trimmed) return list;
    return list.filter(
      (item) =>
        item.q.toLowerCase().includes(trimmed) ||
        item.a.toLowerCase().includes(trimmed) ||
        item.meta.topic.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const safeActiveIdx = Math.min(activeIdx, Math.max(0, filteredFaqs.length - 1));
  const activeItem = filteredFaqs[safeActiveIdx] ?? null;

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setActiveIdx(0);
    setMobileOpenIdx(0);
  };

  const handleStep = (delta: number) => {
    if (filteredFaqs.length <= 1) return;
    setActiveIdx((safeActiveIdx + delta + filteredFaqs.length) % filteredFaqs.length);
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredFaqs.length <= 1) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(-1);
    }
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 text-[#0F172A] md:py-32"
    >
      <div className="grid-lines-light pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Header + Search Control */}
        <div
          data-gsap-heading
          className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
        >
          <div>
            <div className="footer-text-glow footer-text-glow-light mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#4B0BAA]">
              FAQ
            </div>
            <h2 className="footer-text-glow footer-text-glow-light font-display text-4xl font-black uppercase leading-[0.94] tracking-tight text-balance text-[#0F172A] sm:text-5xl md:text-7xl">
              From brief{' '}
              <span className="text-[#4B0BAA]">
                to launch.
              </span>
            </h2>
          </div>

          <div className="flex w-full flex-col gap-3 sm:max-w-md lg:items-end">
            <p className="text-sm leading-relaxed text-[#64748B] md:text-base lg:text-right">
              Clear answers on scope, delivery timelines, pricing and remote collaboration.
            </p>

            {/* Instant Keyword Search Filter */}
            <div className="relative w-full">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B0BAA]"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search scope, timelines, WhatsApp..."
                aria-label="Search frequently asked questions"
                className="min-h-[44px] w-full rounded-full border border-[#C4B5FD] bg-white py-2.5 pl-11 pr-10 text-sm text-[#0F172A] shadow-sm transition placeholder:text-[#64748B]/75 focus:border-[#4B0BAA] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/25"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear FAQ search"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#E9D5FF]/60 hover:text-[#31006B]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty Search Fallback */}
        {filteredFaqs.length === 0 ? (
          <div className="rounded-3xl border border-[#C4B5FD]/70 bg-white p-10 text-center shadow-sm">
            <div className="font-display text-lg font-bold text-[#0F172A]">
              No answers matched &ldquo;{query}&rdquo;
            </div>
            <p className="mt-2 text-sm text-[#64748B]">
              Try another keyword or message our studio team directly for a custom project answer.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="footer-glass-pill footer-glass-pill-light inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider"
              >
                Reset Search
              </button>
              <a
                href={buildWhatsAppUrl(
                  AGENCY_CONTACT.phones[0].raw,
                  `Hi BRANDFIY, I have a question about: ${query}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#4B0BAA] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#31006B]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Split Interactive Studio Desk */}
            <div
              data-gsap-reveal
              data-gsap-delay="0.16"
              className="hidden items-stretch gap-8 lg:grid lg:grid-cols-12"
            >
              {/* Left Column: Indexed Question Selector */}
              <div
                role="tablist"
                aria-label="Frequently asked questions"
                onKeyDown={handleListKeyDown}
                className="flex flex-col justify-between gap-2 lg:col-span-5"
              >
                {filteredFaqs.map((item, idx) => {
                  const isSelected = safeActiveIdx === idx;
                  return (
                    <button
                      key={item.q}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveIdx(idx)}
                      className={`group relative flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4B0BAA] ${
                        isSelected
                          ? 'text-white'
                          : 'border border-transparent text-[#0F172A] hover:border-[#C4B5FD]/70 hover:bg-white/90'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="faqActiveRow"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 32,
                          }}
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#31006B] to-[#4B0BAA] shadow-[0_14px_30px_rgba(49,0,107,0.22)]"
                        />
                      )}

                      <div className="relative z-10 flex min-w-0 items-baseline gap-3.5">
                        <span
                          className={`shrink-0 font-mono text-xs font-bold tabular-nums ${
                            isSelected ? 'text-[#C4B5FD]' : 'text-[#8B5CF6]'
                          }`}
                        >
                          {String(item.originalIndex + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="font-display text-sm font-bold leading-snug xl:text-base">
                            {item.q}
                          </div>
                          <div
                            className={`mt-0.5 text-[11px] font-medium ${
                              isSelected ? 'text-[#E9D5FF]/75' : 'text-[#64748B]'
                            }`}
                          >
                            {item.meta.topic}
                          </div>
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                          isSelected
                            ? 'border-[#C4B5FD]/50 bg-[#8B5CF6] text-white'
                            : 'border-[#C4B5FD]/60 text-[#4B0BAA] opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100'
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: High-Contrast Deep Purple Answer Stage */}
              {activeItem && (
                <div
                  role="tabpanel"
                  aria-label={activeItem.q}
                  className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#8B5CF6]/35 bg-gradient-to-br from-[#31006B] via-[#3A0080] to-[#1D0044] p-9 text-white shadow-[0_28px_72px_rgba(49,0,107,0.24)] lg:col-span-7 xl:p-11"
                >
                  {/* Subtle BrandMark Watermark Pattern */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none -right-12 -top-12 absolute opacity-[0.07]"
                  >
                    <BrandMark withBadge className="h-52 w-52" />
                  </div>

                  <div>
                    {/* Clean Unboxed Metadata + Prev/Next Stepper */}
                    <div className="relative z-10 flex items-center justify-between gap-4 border-b border-[#C4B5FD]/20 pb-5">
                      <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.26em] text-[#C4B5FD] tabular-nums">
                        <span>
                          Question {String(activeItem.originalIndex + 1).padStart(2, '0')} /{' '}
                          {String(FAQS.length).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true" className="text-[#8B5CF6]">
                          ·
                        </span>
                        <span className="text-[#E9D5FF]/85">{activeItem.meta.topic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStep(-1)}
                          disabled={filteredFaqs.length <= 1}
                          aria-label="Previous question"
                          className="footer-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStep(1)}
                          disabled={filteredFaqs.length <= 1}
                          aria-label="Next question"
                          className="footer-glass-pill inline-flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Animated Answer Transition */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeItem.q}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                        className="relative z-10 mt-8"
                      >
                        <h3 className="footer-text-glow font-display text-2xl font-black leading-tight text-balance text-white xl:text-4xl">
                          {activeItem.q}
                        </h3>
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#E9D5FF]/90 xl:text-lg">
                          {activeItem.a}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Action & Progress Bar */}
                  <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#C4B5FD]/20 pt-6">
                    <div className="flex items-center gap-1.5">
                      {filteredFaqs.map((item, idx) => (
                        <button
                          key={item.q}
                          type="button"
                          onClick={() => setActiveIdx(idx)}
                          aria-label={`Select question ${idx + 1}`}
                          className={`h-2 rounded-full transition-all duration-200 ${
                            safeActiveIdx === idx
                              ? 'w-8 bg-white'
                              : 'w-2.5 bg-[#C4B5FD]/35 hover:bg-[#C4B5FD]/75'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={activeItem.meta.actionHref}
                        className="inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#C4B5FD] transition hover:text-white hover:underline"
                      >
                        <span>{activeItem.meta.actionLabel}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href={buildWhatsAppUrl(
                          AGENCY_CONTACT.phones[0].raw,
                          `Hi BRANDFIY! Quick question regarding "${activeItem.q}"`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Chat"
                        className="footer-glass-pill inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider"
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        <span>Ask on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile & Tablet Numbered Accordion */}
            <div data-gsap-reveal data-gsap-delay="0.14" className="grid gap-3 lg:hidden">
              {filteredFaqs.map((item, idx) => {
                const isOpen = mobileOpenIdx === idx;
                return (
                  <div
                    key={item.q}
                    className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
                      isOpen
                        ? 'border-[#4B0BAA] bg-[#31006B] text-white shadow-[0_14px_34px_rgba(49,0,107,0.18)]'
                        : 'border-[#E9D5FF] bg-white text-[#0F172A]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setMobileOpenIdx(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    >
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span
                          className={`shrink-0 font-mono text-xs font-bold tabular-nums ${
                            isOpen ? 'text-[#C4B5FD]' : 'text-[#8B5CF6]'
                          }`}
                        >
                          {String(item.originalIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-base font-bold leading-snug">
                          {item.q}
                        </span>
                      </div>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                          isOpen
                            ? 'rotate-45 border-[#C4B5FD]/50 bg-[#8B5CF6] text-white'
                            : 'border-[#C4B5FD] text-[#4B0BAA]'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#C4B5FD]/20 px-5 pb-5 pt-4">
                            <p className="text-sm leading-relaxed text-[#E9D5FF]/90">
                              {item.a}
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                              <a
                                href={item.meta.actionHref}
                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C4B5FD] hover:underline"
                              >
                                <span>{item.meta.actionLabel}</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={buildWhatsAppUrl(
                                  AGENCY_CONTACT.phones[0].raw,
                                  `Hi BRANDFIY! Quick question regarding "${item.q}"`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-glass-pill inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 font-display text-[11px] font-bold uppercase tracking-wider"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>WhatsApp Us</span>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
