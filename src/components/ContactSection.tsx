import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { AGENCY_CONTACT, buildWhatsAppUrl } from '../data/agencyData';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROJECT_SERVICES = [
  'Digital Marketing',
  'Brand Strategy & Identity',
  'Graphic Design',
  'Video Production',
  'Social Media Management',
  'Website Development',
  'Creative Advertising',
];

const BUDGET_RANGES = [
  'Under ₹15k',
  '₹15k – ₹40k',
  '₹40k – ₹1L',
  '₹1L+',
  'Not sure yet',
];

const TIMELINES = ['ASAP (1–2 wks)', 'This Month', 'Flexible'];

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Brand Strategy & Identity',
  ]);
  const [budget, setBudget] = useState('Not sure yet');
  const [timeline, setTimeline] = useState('This Month');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedBrief, setSubmittedBrief] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.length > 1
          ? prev.filter((s) => s !== service)
          : prev
        : [...prev, service]
    );
  };

  const buildBriefText = () => {
    return [
      `Hi BRANDFIY! Let's build my brand.`,
      `Name: ${name.trim()}`,
      `Contact: ${contact.trim()}`,
      `Services: ${selectedServices.join(', ')}`,
      `Budget: ${budget}`,
      `Timeline: ${timeline}`,
      notes.trim() ? `Details: ${notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setErrorMsg('Please add your name and a phone number or email so we can reply.');
      return;
    }

    const emailOrPhoneValid =
      contact.includes('@') || contact.replace(/[^0-9]/g, '').length >= 7;
    if (!emailOrPhoneValid) {
      setErrorMsg('Please enter a valid email address or phone number.');
      return;
    }

    setErrorMsg(null);
    setSubmittedBrief(buildBriefText());
  };

  const handleCopyBrief = async () => {
    const text = submittedBrief ?? buildBriefText();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBrief(true);
      window.setTimeout(() => setCopiedBrief(false), 2000);
    } catch {
      // Clipboard blocked in sandboxed iframe — silent fallback
    }
  };

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(AGENCY_CONTACT.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard blocked in sandboxed iframe — silent fallback
    }
  };

  const completionSteps =
    (name.trim() ? 1 : 0) +
    (contact.trim() ? 1 : 0) +
    (selectedServices.length > 0 ? 1 : 0) +
    (notes.trim() ? 1 : 0);
  const progressPercent = Math.max(25, Math.round((completionSteps / 4) * 100));

  return (
    <section
      id="contact"
      className="grain relative overflow-hidden bg-gradient-to-br from-[#E9D5FF] via-[#F8FAFC] to-[#C4B5FD]/60 py-20 text-[#0F172A] md:py-32"
    >
      <div className="grid-lines-light pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Section Header */}
        <div
          data-gsap-heading
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="footer-text-glow footer-text-glow-light mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#4B0BAA]">
              Let’s work together
            </div>
            <h2 className="footer-text-glow footer-text-glow-light font-display text-4xl font-black uppercase leading-[0.92] tracking-tight text-balance text-[#0F172A] sm:text-5xl md:text-7xl">
              Let’s build your{' '}
              <span className="text-[#4B0BAA]">brand.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-[#475569] md:text-base lg:text-right">
            Tell us what you are launching or scaling. Assemble your brief in 60 seconds and send it straight to our studio WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 md:mt-14 lg:grid-cols-12 lg:gap-10">
          {/* Direct Channels Aside */}
          <aside
            data-gsap-stagger
            data-gsap-delay="0.12"
            data-gsap-stagger-step="0.085"
            className="flex flex-col justify-between gap-4 lg:col-span-5"
          >
            <div
              data-gsap-item
              className="rounded-3xl border border-[#8B5CF6]/35 bg-gradient-to-br from-[#31006B] via-[#3A0080] to-[#1D0044] p-6 text-white shadow-[0_22px_54px_rgba(49,0,107,0.22)] md:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="footer-text-glow font-display text-xs font-bold uppercase tracking-widest text-[#C4B5FD]">
                  WhatsApp &amp; Phone
                </span>
                <span className="text-xs font-medium text-[#E9D5FF]/80">
                  Direct studio response
                </span>
              </div>

              <div className="space-y-4">
                {AGENCY_CONTACT.phones.map((phone) => (
                  <div
                    key={phone.raw}
                    className="flex items-center justify-between gap-3 border-b border-[#C4B5FD]/15 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-wider text-[#C4B5FD]/75">
                        {phone.label}
                      </div>
                      <a
                        href={`tel:+${phone.raw}`}
                        className="mt-0.5 block whitespace-nowrap font-display text-base font-bold tabular-nums text-white transition hover:text-[#C4B5FD] md:text-lg"
                      >
                        {phone.display}
                      </a>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <a
                        href={`tel:+${phone.raw}`}
                        aria-label={`Call ${phone.display}`}
                        className="footer-glass-pill flex h-10 w-10 items-center justify-center rounded-full text-white"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                      <a
                        href={buildWhatsAppUrl(
                          phone.raw,
                          'Hi BRANDFIY! I have a creative project in mind.'
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${phone.display}`}
                        className="footer-glass-pill flex h-10 w-10 items-center justify-center rounded-full text-white"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Email Card with Quick Copy */}
            <motion.div
              data-gsap-item
              whileHover={{ y: -3 }}
              className="group flex items-center justify-between gap-3 rounded-3xl border border-[#C4B5FD] bg-white/95 p-5 shadow-xs transition hover:border-[#8B5CF6] hover:bg-white"
            >
              <a
                href={`mailto:${AGENCY_CONTACT.email}`}
                className="flex min-w-0 flex-1 items-center gap-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4B0BAA]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4B0BAA] text-white transition-transform duration-200 group-hover:scale-105">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Official Email
                  </div>
                  <div className="truncate font-semibold text-[#0F172A]">
                    {AGENCY_CONTACT.email}
                  </div>
                </div>
              </a>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#C4B5FD]/80 bg-[#F8FAFC] px-3 text-[11px] font-bold uppercase tracking-wider text-[#4B0BAA] transition hover:border-[#4B0BAA] hover:bg-[#E9D5FF]/50"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`mailto:${AGENCY_CONTACT.email}`}
                  aria-label={`Email ${AGENCY_CONTACT.email}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#4B0BAA] transition group-hover:rotate-45"
                >
                  <ArrowUpRight className="h-5 w-5 shrink-0" />
                </a>
              </div>
            </motion.div>

            {/* Social Card */}
            <motion.a
              data-gsap-item
              whileHover={{ y: -3 }}
              href={AGENCY_CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-3xl border border-[#C4B5FD] bg-white/95 p-5 shadow-xs transition hover:border-[#8B5CF6] hover:bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#31006B] text-[#C4B5FD] transition-transform duration-200 group-hover:scale-105">
                  <Instagram className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Instagram &amp; Facebook
                  </div>
                  <div className="font-semibold text-[#0F172A]">
                    {AGENCY_CONTACT.socialHandle}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-[#4B0BAA] transition group-hover:rotate-45" />
            </motion.a>

            {/* Studio Territory Card */}
            <div
              data-gsap-item
              className="flex items-center gap-4 rounded-3xl border border-[#C4B5FD] bg-white/85 p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9D5FF] text-[#4B0BAA]">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Website &amp; Studio
                </div>
                <div className="font-semibold text-[#0F172A]">
                  {AGENCY_CONTACT.domain} · {AGENCY_CONTACT.location}
                </div>
              </div>
            </div>
          </aside>

          {/* Interactive WhatsApp Project Brief Builder */}
          <div
            data-gsap-reveal
            data-gsap-delay="0.2"
            data-gsap-duration="0.84"
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#8B5CF6]/35 bg-gradient-to-br from-[#31006B] via-[#3A0080] to-[#1D0044] p-6 text-white shadow-[0_28px_72px_rgba(49,0,107,0.28)] md:p-10 lg:col-span-7"
          >
            <div className="pointer-events-none -right-16 -top-16 absolute h-64 w-64 rounded-full bg-[#8B5CF6]/25 blur-3xl" />

            <AnimatePresence mode="wait">
              {submittedBrief ? (
                <motion.div
                  key="brief-ready"
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className="relative z-10 flex min-h-[460px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C4B5FD]/60 bg-gradient-to-br from-[#4B0BAA] to-[#8B5CF6] text-white shadow-[0_12px_32px_rgba(139,92,246,0.45)]"
                  >
                    <Check className="h-10 w-10" />
                  </motion.div>

                  <h3 className="footer-text-glow mt-6 font-display text-2xl font-black uppercase md:text-4xl">
                    Brief ready for WhatsApp!
                  </h3>
                  <p className="mt-3 max-w-md text-sm text-[#E9D5FF]/85 md:text-base">
                    Your brief for{' '}
                    <span className="font-semibold text-white">
                      {selectedServices.join(', ')}
                    </span>{' '}
                    is structured and ready to send.
                  </p>

                  {/* Structured Brief Summary Preview */}
                  <pre className="mt-6 max-w-lg whitespace-pre-wrap rounded-2xl border border-[#C4B5FD]/25 bg-[#19003B]/75 px-5 py-4 text-left font-sans text-xs leading-relaxed text-[#E9D5FF]">
                    {submittedBrief}
                  </pre>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <a
                      href={buildWhatsAppUrl(
                        AGENCY_CONTACT.phones[0].raw,
                        submittedBrief
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-glass-pill inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 font-display text-xs font-black uppercase tracking-wider text-white"
                    >
                      <span>Open WhatsApp Chat</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyBrief}
                      className="footer-glass-pill inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      {copiedBrief ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedBrief ? 'Copied!' : 'Copy Brief'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmittedBrief(null)}
                      className="footer-glass-pill inline-flex min-h-[44px] items-center rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#E9D5FF]"
                    >
                      Edit Brief
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="brief-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  className="relative z-10"
                  noValidate
                >
                  {/* Form Top Header + Progress Readout */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#C4B5FD]/15 pb-5">
                    <div>
                      <h3 className="footer-text-glow font-display text-2xl font-black uppercase md:text-3xl">
                        Start a project
                      </h3>
                      <p className="mt-1 text-sm text-[#E9D5FF]/75">
                        Pick what you need — we assemble a ready-to-send brief.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold tabular-nums text-[#C4B5FD]">
                        {progressPercent}% Ready
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8B5CF6]/50 bg-[#4B0BAA] text-[#C4B5FD]">
                        <Send className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Subtle Brief Readiness Progress Track */}
                  <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#E9D5FF]"
                    />
                  </div>

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        role="alert"
                        className="mb-6 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-xs font-medium text-red-200"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="brief-name"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#C4B5FD]"
                      >
                        Your name
                      </label>
                      <input
                        id="brief-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="e.g. Alex Morgan"
                        className="w-full rounded-xl border border-[#C4B5FD]/25 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-[#8B5CF6] focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/25"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="brief-contact"
                        className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#C4B5FD]"
                      >
                        Phone or email
                      </label>
                      <input
                        id="brief-contact"
                        type="text"
                        value={contact}
                        onChange={(e) => {
                          setContact(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="+91 ... or email"
                        className="w-full rounded-xl border border-[#C4B5FD]/25 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-[#8B5CF6] focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/25"
                      />
                    </div>
                  </div>

                  {/* Services selector */}
                  <div className="mt-6">
                    <div className="mb-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#C4B5FD]">
                      <span>What are we building?</span>
                      <span className="font-mono text-[11px] font-medium tabular-nums text-[#E9D5FF]/70">
                        {selectedServices.length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_SERVICES.map((service) => {
                        const active = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            aria-pressed={active}
                            className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition duration-150 ${
                              active
                                ? 'border-[#C4B5FD]/70 bg-gradient-to-r from-[#4B0BAA] to-[#8B5CF6] text-white shadow-[0_6px_18px_rgba(139,92,246,0.3)]'
                                : 'border-[#C4B5FD]/25 bg-white/[0.03] text-[#E9D5FF]/85 hover:border-[#C4B5FD]/60 hover:bg-white/[0.07]'
                            }`}
                          >
                            {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                            <span>{service}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Range with Animated Spring Highlight */}
                  <div className="mt-6">
                    <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#C4B5FD]">
                      Estimated budget
                    </div>
                    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#C4B5FD]/15 bg-[#1B0042]/65 p-1.5 sm:grid-cols-5">
                      {BUDGET_RANGES.map((item) => {
                        const active = budget === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setBudget(item)}
                            aria-pressed={active}
                            className={`relative min-h-[40px] rounded-xl px-2.5 py-2 text-xs font-semibold tabular-nums transition-colors ${
                              active
                                ? 'text-[#31006B]'
                                : 'text-[#E9D5FF]/85 hover:text-white'
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="contactBudgetActive"
                                transition={{
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 32,
                                }}
                                className="absolute inset-0 rounded-xl bg-white shadow-sm"
                              />
                            )}
                            <span className="relative z-10">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline with Animated Spring Highlight */}
                  <div className="mt-6">
                    <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-[#C4B5FD]">
                      Target timeline
                    </div>
                    <div className="grid gap-2 rounded-2xl border border-[#C4B5FD]/15 bg-[#1B0042]/65 p-1.5 sm:grid-cols-3">
                      {TIMELINES.map((item) => {
                        const active = timeline === item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setTimeline(item)}
                            aria-pressed={active}
                            className={`relative min-h-[40px] rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                              active
                                ? 'text-white'
                                : 'text-[#E9D5FF]/80 hover:text-white'
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="contactTimelineActive"
                                transition={{
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 32,
                                }}
                                className="absolute inset-0 rounded-xl border border-[#C4B5FD]/50 bg-gradient-to-r from-[#4B0BAA] to-[#8B5CF6]"
                              />
                            )}
                            <span className="relative z-10">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label
                      htmlFor="brief-notes"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#C4B5FD]"
                    >
                      Tell us about it
                    </label>
                    <textarea
                      id="brief-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share your brand, goals, or links to references..."
                      className="w-full rounded-xl border border-[#C4B5FD]/25 bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-[#8B5CF6] focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/25"
                    />
                  </div>

                  <button
                    type="submit"
                    className="footer-glass-pill mt-7 flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 font-display text-sm font-black uppercase tracking-wider text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    <span>Prepare Brief for WhatsApp</span>
                    <Send className="h-4 w-4" />
                  </button>

                  <p className="mt-3 text-center text-xs text-[#C4B5FD]/70">
                    No spam, no automated funnel — direct creative consultation.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
