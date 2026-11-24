export const BRAND_LOGOS = {
  horizontal: '/assets/aistudio/H_white-on-purple_horizontal_transparent_db123ddc.png',
  stacked: '/assets/aistudio/H_white-on-purple_stacked_transparent_2789ef77.png',
  fullTagline: '/assets/aistudio/F_black-and-white_white_1a1c0cc2.png',
  icon: '/assets/aistudio/A_icon_white_8bb3c8f1.png',
} as const;

export const UPLOADED_POSTERS = {
  hireCreativeAgency: '/assets/aistudio/Instagram_post_4_5_1x_10e6e77c.png',
  notBoring: '/assets/aistudio/Instagram_post_2_1x_f4ee159f.png',
  ctrlZ: '/assets/aistudio/Ctrl___Z_Marketing_Poster_e27e777f.png',
  eagleLimits: '/assets/aistudio/Brandify_Eagle__Beyond_Limits_340bed5b.png',
  liftsBrandUp: '/assets/aistudio/Brandify_Lifts_Your_Brand_Up_b67be188.png',
  beeAmplify: '/assets/aistudio/Brandify_Bee__Amplify_Your_Brand_476451e8.png',
  digitalMarketingEngine: '/assets/aistudio/Brandfiy_-_1.jpg_9abba74f.jpeg',
} as const;

export const GENERATED_MEDIA = {
  c2Branding: '/src/assets/images/c2_couture_branding_1795337838421.jpg',
  flyBranding: '/src/assets/images/fly_market_branding_1795337838041.jpg',
  sipCoffee: '/src/assets/images/sip_cup_coffee_1795337838844.jpg',
  eloraWeb: '/src/assets/images/elora_fragrance_web_1795337837527.jpg',
  mirrorWeb: '/src/assets/images/mirror_auto_web_1795337839040.jpg',
  shayWeb: '/src/assets/images/shay_tehran_web_1795337838818.jpg',
} as const;

export interface ServiceItem {
  n: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  deliverables: string;
}

export interface PillarItem {
  k: string;
  line: string;
  body: string;
  img: string;
}

export type WorkCategory =
  | 'All'
  | 'Campaigns'
  | 'Branding'
  | 'Digital Marketing'
  | 'Social';

export interface WorkItem {
  title: string;
  client: string;
  cat: Exclude<WorkCategory, 'All'>;
  year: string;
  blurb: string;
  tags: string[];
  images: string[];
  featured?: boolean;
}

export interface WebProject {
  name: string;
  kind: string;
  url: string;
  blurb: string;
  tags: string[];
  accent: string;
  bgTone: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  img: string;
  metrics: { label: string; value: string }[];
}

export interface LogoAnatomyPart {
  id: string;
  code: string;
  title: string;
  pillar: string;
  desc: string;
  spec: string;
}

export interface StudioPillar {
  name: string;
  short: string;
  role: string;
  bio: string;
  wa: string;
  phoneDisplay: string;
  focus: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  scope: string;
  metricValue: string;
  metricLabel: string;
  projectImage: string;
}

export const AGENCY_CONTACT = {
  brandName: 'BRANDFIY',
  tagline: 'Create. Connect. Grow.',
  domain: 'Brandfiy.in',
  websiteUrl: 'https://brandfiy.in',
  email: 'brandfiy.official@gmail.com',
  instagram: 'https://instagram.com/brandfiy.in',
  facebook: 'https://facebook.com/brandfiy.in',
  socialHandle: '@Brandfiy.in',
  location: 'Kerala, India · Serving Worldwide',
  phones: [
    { label: 'Primary Line', display: '+91 91804 29400', raw: '919180429400' },
    { label: 'Studio Desk', display: '+91 761 947 0354', raw: '917619470354' },
  ],
};

export function buildWhatsAppUrl(phoneRaw: string, message: string): string {
  return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`;
}

export const MARQUEE_SERVICES = [
  'Digital Marketing',
  'Brand Strategy',
  'Graphic Design',
  'Video Production',
  'Social Media',
  'Web Development',
  'Creative Advertising',
  'Content Creation',
];

export const MARQUEE_CLIENTS = [
  { name: 'Ctrl+Z Campaign', img: UPLOADED_POSTERS.ctrlZ },
  { name: 'Beyond Limits', img: UPLOADED_POSTERS.eagleLimits },
  { name: 'Brand Lift', img: UPLOADED_POSTERS.liftsBrandUp },
  { name: 'Amplify Attention', img: UPLOADED_POSTERS.beeAmplify },
  { name: 'Growth Engine', img: UPLOADED_POSTERS.digitalMarketingEngine },
  { name: 'Creative Partner', img: UPLOADED_POSTERS.hireCreativeAgency },
  { name: 'Not Boring', img: UPLOADED_POSTERS.notBoring },
];

export const SERVICES: ServiceItem[] = [
  {
    n: '01',
    title: 'Digital Marketing',
    desc: 'Strategy, creative and performance marketing under one roof — built to turn ad spend into measurable reach, clicks and ROAS.',
    tags: ['Meta & Google Ads', 'Funnel Strategy', 'ROAS Optimization'],
    img: UPLOADED_POSTERS.digitalMarketingEngine,
    deliverables: 'Campaign strategy, paid creative, conversion tracking & reporting',
  },
  {
    n: '02',
    title: 'Brand Strategy & Identity',
    desc: 'Brand identities, geometric monograms, typography systems and guidelines engineered to turn businesses into unmistakable brands.',
    tags: ['Logo Construction', 'Brand Guidelines', 'Stationery & Apparel'],
    img: UPLOADED_POSTERS.eagleLimits,
    deliverables: 'Complete identity system, color & type rules, brand presentation',
  },
  {
    n: '03',
    title: 'Graphic Design',
    desc: 'High-impact campaign posters, Instagram carousels, outdoor billboards and print layouts that refuse to blend into the feed.',
    tags: ['Campaign Posters', 'Instagram Carousels', 'Billboards & Print'],
    img: UPLOADED_POSTERS.ctrlZ,
    deliverables: 'Print-ready artwork, social templates, outdoor & event suites',
  },
  {
    n: '04',
    title: 'Video Production & Editing',
    desc: '4K brand films, commercial ad spots and dynamic reel edits with sharp pacing, custom sound design and voice-over.',
    tags: ['Brand Films (4K)', 'Reel Covers', 'Ad Spots'],
    img: UPLOADED_POSTERS.beeAmplify,
    deliverables: '4K 16:9 brand films, vertical reels, motion titles & sound mix',
  },
  {
    n: '05',
    title: 'Social Media Management',
    desc: 'Full monthly content calendars pairing strategic posts, reels, stories and carousels to build lasting audience momentum.',
    tags: ['Content Calendars', 'Feed Systems', 'Community Growth'],
    img: UPLOADED_POSTERS.hireCreativeAgency,
    deliverables: 'Monthly calendar, grid art direction, copywriting & publishing',
  },
  {
    n: '06',
    title: 'Website Design & Development',
    desc: 'We create powerful digital storefronts and agency websites — custom UI/UX engineered for speed across mobile, tablet and desktop.',
    tags: ['Custom Web Apps', 'Mobile-First UX', 'Performance SEO'],
    img: UPLOADED_POSTERS.notBoring,
    deliverables: 'Responsive web design, production frontend, speed optimization',
  },
  {
    n: '07',
    title: 'Creative Advertising',
    desc: 'Concept-driven visual advertising that challenges boring marketing and commands instant attention across every scroll.',
    tags: ['Concept Art', '3D Visuals', 'Launch Campaigns'],
    img: UPLOADED_POSTERS.liftsBrandUp,
    deliverables: 'Hero campaign key visuals, ad variations, outdoor adaptations',
  },
  {
    n: '08',
    title: 'Content Creation',
    desc: 'Not just pretty posts — strategy-backed stories, swipeable carousels and brand narratives engineered to educate and convert.',
    tags: ['Carousel Systems', 'Visual Storytelling', 'Reel Scripts'],
    img: GENERATED_MEDIA.c2Branding,
    deliverables: 'Monthly content packs, script decks, photography direction',
  },
  {
    n: '09',
    title: 'Marketing Campaigns',
    desc: 'End-to-end launch orchestration uniting outdoor billboards, merchandise, social grids and paid media into one voice.',
    tags: ['Omnichannel Launch', 'Outdoor & Merch', 'Performance'],
    img: GENERATED_MEDIA.flyBranding,
    deliverables: 'Full campaign blueprint, multi-channel assets & launch tracking',
  },
];

export const PILLARS: PillarItem[] = [
  {
    k: 'Create.',
    line: 'We turn businesses into brands with solid structural identity.',
    body: 'Like our F carved cleanly from a heavy chamfered B, great brands take shape when the right idea is engineered into a rock-solid foundation.',
    img: UPLOADED_POSTERS.hireCreativeAgency,
  },
  {
    k: 'Connect.',
    line: 'Your brand isn’t boring — so stop settling for boring marketing.',
    body: 'Our mark opens outward so ideas leave the frame and reach real people through thumb-stopping visuals, 4K brand films and cohesive social calendars.',
    img: UPLOADED_POSTERS.notBoring,
  },
  {
    k: 'Grow.',
    line: 'A great brand still needs performance marketing to move fast.',
    body: 'We pair creative direction with Meta & Google ad execution — turning brand equity into 1.2M+ reach, qualified clicks and measurable 4.8x ROAS.',
    img: UPLOADED_POSTERS.digitalMarketingEngine,
  },
  {
    k: 'Beyond Limits.',
    line: 'Plan it right before you spend. Brandfiy makes every move count.',
    body: 'From 16 px favicons to city billboards, stationery, apparel and responsive web builds — one in-house team handles every touchpoint.',
    img: UPLOADED_POSTERS.eagleLimits,
  },
];

export const WORK_CATEGORIES: WorkCategory[] = [
  'All',
  'Campaigns',
  'Branding',
  'Digital Marketing',
  'Social',
];

export const PORTFOLIO_WORKS: WorkItem[] = [
  {
    title: "You Can't Undo Bad Marketing",
    client: 'BRANDFIY Campaign',
    cat: 'Campaigns',
    year: '2026',
    blurb: 'Shattered Ctrl+Z 3D keycap visual campaign reminding founders to plan creative strategy right before spending ad budget.',
    tags: ['3D Key Visual', 'Creative Advertising', 'Poster'],
    images: [UPLOADED_POSTERS.ctrlZ, UPLOADED_POSTERS.digitalMarketingEngine],
    featured: true,
  },
  {
    title: 'Strong Branding Sees Beyond Limits',
    client: 'BRANDFIY Identity Series',
    cat: 'Branding',
    year: '2026',
    blurb: 'High-contrast eagle editorial key visual showcasing clarity, vision and fearless brand positioning.',
    tags: ['Art Direction', 'Brand Positioning', 'Composite'],
    images: [UPLOADED_POSTERS.eagleLimits, UPLOADED_POSTERS.beeAmplify],
    featured: true,
  },
  {
    title: 'Brandfiy Lifts Your Brand Up',
    client: 'BRANDFIY Growth Series',
    cat: 'Campaigns',
    year: '2026',
    blurb: 'Bold conceptual campaign illustrating how strategic design and marketing pull stagnant brands back to growth.',
    tags: ['3D Concept', 'Growth Campaign', 'Social Poster'],
    images: [UPLOADED_POSTERS.liftsBrandUp, UPLOADED_POSTERS.hireCreativeAgency],
    featured: true,
  },
  {
    title: 'Amplify Your Brand Attention',
    client: 'BRANDFIY Brand Voice',
    cat: 'Branding',
    year: '2026',
    blurb: 'Hyper-detailed purple macro campaign turning businesses into unforgettable brands that command attention.',
    tags: ['Macro 3D', 'Brand Awareness', 'Poster'],
    images: [UPLOADED_POSTERS.beeAmplify, UPLOADED_POSTERS.notBoring],
  },
  {
    title: 'Digital Marketing Engine',
    client: 'BRANDFIY Performance',
    cat: 'Digital Marketing',
    year: '2026',
    blurb: "Don't let a powerful brand crawl on bicycle wheels — visual metaphor for pairing brand identity with paid performance.",
    tags: ['Performance Ads', 'Visual Metaphor', 'Campaign'],
    images: [UPLOADED_POSTERS.digitalMarketingEngine, UPLOADED_POSTERS.ctrlZ],
  },
  {
    title: 'Hire a Creative Agency',
    client: 'BRANDFIY Social Suite',
    cat: 'Social',
    year: '2026',
    blurb: 'Not just designers — growth partners. Structured social carousel & feed post system built around Create, Connect, Grow.',
    tags: ['Instagram 4:5', 'Carousel Lead', 'Growth Partner'],
    images: [UPLOADED_POSTERS.hireCreativeAgency, UPLOADED_POSTERS.notBoring],
  },
  {
    title: "Your Brand Isn't Boring",
    client: 'BRANDFIY Web & Social',
    cat: 'Social',
    year: '2026',
    blurb: 'Anti-bland marketing showcase uniting strategy, creativity and growth across web and social touchpoints.',
    tags: ['Social Poster', 'Strategy', 'Web Showcase'],
    images: [UPLOADED_POSTERS.notBoring, UPLOADED_POSTERS.liftsBrandUp],
  },
  {
    title: 'C2 — Cloth to Couture',
    client: 'C2 Clothing',
    cat: 'Branding',
    year: '2025',
    blurb: 'Bespoke couture tailoring identity built around structured monogram geometry, woven tags and matte slate packaging.',
    tags: ['Identity', 'Packaging', 'Monogram'],
    images: [GENERATED_MEDIA.c2Branding, GENERATED_MEDIA.flyBranding],
  },
  {
    title: 'FLY Market Retail Identity',
    client: 'Fly Retail',
    cat: 'Branding',
    year: '2025',
    blurb: 'High-contrast retail identity system with modular packaging, canvas totes and clean shelf typography.',
    tags: ['Retail System', 'Merchandise', 'Type'],
    images: [GENERATED_MEDIA.flyBranding, GENERATED_MEDIA.sipCoffee],
  },
];

export const LOGO_ANATOMY: LogoAnatomyPart[] = [
  {
    id: 'solid-b',
    code: '01 / THE SOLID B',
    title: 'Engineered Foundation',
    pillar: 'Structure & Strategy',
    desc: 'A heavy, chamfered B representing structure, strategy and a brand that stands firm. The stepped waist and 45° cut corners give it a precise, engineered feel.',
    spec: '34–38 U Outer Walls · 45° Angled Cuts',
  },
  {
    id: 'negative-f',
    code: '02 / THE F IN NEGATIVE SPACE',
    title: 'Carved From Within',
    pillar: 'CREATE',
    desc: 'The F is carved out of the B, not drawn on top. That is CREATE: a brand takes shape when the right idea is cut into a solid foundation.',
    spec: '24 U Constant F Stroke Weight',
  },
  {
    id: 'the-opening',
    code: '03 / THE OPENING',
    title: 'Open to the World',
    pillar: 'CONNECT & GROW',
    desc: "The F's top arm runs through the B's right wall into open space. That is CONNECT: the idea leaves the shape and reaches the audience. Bold weight on a solid base stands for GROW.",
    spec: '16 px Min Size · 1X Clear Space',
  },
];

export const PERFORMANCE_METRICS = [
  { label: 'Campaign Reach', value: '1.2M', detail: 'Sample cross-channel campaign' },
  { label: 'Verified Clicks', value: '48.6K', detail: 'Meta & display banners' },
  { label: 'Avg. CTR', value: '3.9%', detail: 'Strategy-led creative' },
  { label: 'Campaign ROAS', value: '4.8x', detail: 'Performance + design' },
];

export const WEB_PROJECTS: WebProject[] = [
  {
    name: 'Brandfiy.in',
    kind: 'Creative Agency Flagship',
    url: 'brandfiy.in',
    blurb: 'Our flagship digital studio platform built to showcase strategy, design, 4K video, social calendars and responsive engineering.',
    tags: ['Brand Identity', 'Digital Marketing', 'Web Design'],
    accent: '#C4B5FD',
    bgTone: 'from-[#31006B] via-[#4B0BAA] to-[#1E0042]',
    heroTitle: 'WE CREATE POWERFUL BRANDS.',
    heroSubtitle: 'Strategy, design, video, social and web for ambitious businesses.',
    ctaLabel: 'Our Work',
    img: UPLOADED_POSTERS.notBoring,
    metrics: [
      { label: 'Page Speed', value: '99 / 100' },
      { label: 'Client ROAS', value: '4.8x' },
    ],
  },
  {
    name: 'Elora',
    kind: 'Fragrance E-commerce',
    url: 'elora-botanicals.com',
    blurb: 'Editorial fragrance storefront featuring scent-note filtering, tactile product transitions and a distraction-free mobile checkout.',
    tags: ['E-commerce', 'Motion UI', 'Mobile Checkout'],
    accent: '#C4B5FD',
    bgTone: 'from-[#31006B] via-[#4B0BAA] to-[#1E0042]',
    heroTitle: 'BOTANICAL SCENTS IN GLASS',
    heroSubtitle: 'Small-batch neroli, vetiver & cedarwood.',
    ctaLabel: 'Explore Collection',
    img: GENERATED_MEDIA.eloraWeb,
    metrics: [
      { label: 'Mobile Speed', value: '99 / 100' },
      { label: 'Load Time', value: '0.7s' },
    ],
  },
  {
    name: 'Mirror Finish',
    kind: 'Auto Detailing Studio',
    url: 'mirrorfinish.studio',
    blurb: 'High-impact studio booking platform with interactive ceramic-coating package comparisons and instant WhatsApp slot reservations.',
    tags: ['Booking Flow', 'Interactive Specs', 'Dark UI'],
    accent: '#C4B5FD',
    bgTone: 'from-[#1F0046] via-[#31006B] to-[#0F172A]',
    heroTitle: 'CERAMIC GLOSS PERFECTION',
    heroSubtitle: 'Precision paint correction & protection.',
    ctaLabel: 'Book Studio Bay',
    img: GENERATED_MEDIA.mirrorWeb,
    metrics: [
      { label: 'Bookings', value: '+64%' },
      { label: 'Core Vitals', value: 'All Green' },
    ],
  },
  {
    name: 'Shay Tehran',
    kind: 'Tea House & Restaurant',
    url: 'shaytehran.in',
    blurb: 'Atmospheric dining & tea house website with live categorized menu exploration, table reservation requests and story-driven photography.',
    tags: ['Hospitality', 'Interactive Menu', 'Table Booking'],
    accent: '#E9D5FF',
    bgTone: 'from-[#2A0845] via-[#31006B] to-[#0F172A]',
    heroTitle: 'PERSIAN TEA & FIRE',
    heroSubtitle: 'Slow-brewed saffron blends & evening plates.',
    ctaLabel: 'Reserve a Table',
    img: GENERATED_MEDIA.shayWeb,
    metrics: [
      { label: 'Menu Views', value: '3.2x' },
      { label: 'Mobile Share', value: '82%' },
    ],
  },
  {
    name: 'C2 Couture',
    kind: 'Bespoke Menswear Atelier',
    url: 'c2couture.com',
    blurb: 'Full-bleed editorial lookbook and private tailoring appointment portal crafted with restrained luxury typography and smooth page reveals.',
    tags: ['Lookbook', 'Appointment Flow', 'Editorial'],
    accent: '#E9D5FF',
    bgTone: 'from-[#0F172A] via-[#31006B] to-[#1E0042]',
    heroTitle: 'TAILORED TO MEASURE',
    heroSubtitle: 'Architectural suiting crafted in Kerala.',
    ctaLabel: 'Book Fitting',
    img: GENERATED_MEDIA.c2Branding,
    metrics: [
      { label: 'Inquiries', value: '2.4x' },
      { label: 'Viewport Fit', value: '100%' },
    ],
  },
];

export const FOUNDERS: StudioPillar[] = [
  {
    name: 'Create',
    short: 'Strategy & Design',
    role: 'Brand Identity · Posters & Systems',
    bio: 'BRANDFIY is brand + fiy: to make, to shape. We turn businesses into brands with solid logos, packaging, stationery and campaign visuals.',
    wa: '919180429400',
    phoneDisplay: '+91 91804 29400',
    focus: ['Brand Strategy', 'Logo Systems', 'Graphic Design'],
  },
  {
    name: 'Connect',
    short: 'Content & Film',
    role: 'Social Media · 4K Video & Ads',
    bio: 'Monthly content calendars, 4K brand films, reel covers and Meta ad campaigns engineered to reach the exact audience that matters.',
    wa: '917619470354',
    phoneDisplay: '+91 761 947 0354',
    focus: ['Social Management', '4K Video Production', 'Creative Ads'],
  },
  {
    name: 'Grow',
    short: 'Web & Performance',
    role: 'Web Engineering · Paid Scale',
    bio: 'High-speed custom websites paired with performance marketing campaigns driving 1.2M+ reach, 3.9% CTR and measurable 4.8x ROAS.',
    wa: '919180429400',
    phoneDisplay: '+91 91804 29400',
    focus: ['Website Development', 'Performance Marketing', 'Conversion UX'],
  },
];

export const STUDIO_STATS = [
  { value: 9, suffix: '', label: 'Core creative & marketing services' },
  { value: 248, suffix: '+', label: 'Social campaigns & posts shipped' },
  { value: 48, suffix: '.6K', label: 'Verified campaign clicks' },
  { value: 4, suffix: '.8x', label: 'Average client campaign ROAS' },
];

export const FAQS: FaqItem[] = [
  {
    q: 'What services does BRANDFIY provide?',
    a: 'All nine pillars of modern brand growth: Digital Marketing, Brand Strategy & Identity, Graphic Design, Video Production & Editing, Social Media Management, Website Design & Development, Creative Advertising, Content Creation, and Marketing Campaigns.',
  },
  {
    q: 'What does the BRANDFIY logo stand for?',
    a: 'BRANDFIY combines "brand" + "fiy" (to make, to shape). The chamfered B forms a solid foundation, the F carved in negative space represents CREATE, and its open top arm breaking through the right wall represents CONNECT & GROW.',
  },
  {
    q: 'How do I start a project with BRANDFIY?',
    a: 'Use the project brief form at the bottom of this page to send your brief directly on WhatsApp (+91 91804 29400 or +91 761 947 0354), or email brandfiy.official@gmail.com.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Campaign posters or social kits are ready in 3–5 working days. A complete brand identity, 4K brand film or custom responsive website takes 2–6 weeks depending on scope, with clear milestone dates upfront.',
  },
  {
    q: 'Do you handle both branding and digital marketing together?',
    a: 'Yes — that is our core advantage. A great brand still needs digital marketing to move fast, so we build your visual identity and run the Meta/Google ad campaigns, reels and landing pages under one roof.',
  },
  {
    q: 'Do you work with clients outside India?',
    a: 'Yes. We collaborate with ambitious businesses across India and globally via WhatsApp, video calls and shared review boards.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'elora',
    quote:
      'Our old storefront felt slow on mobile and failed to reflect our botanical formulations. BRANDFIY rebuilt the visual system and checkout flow from scratch — mobile page speed jumped to 99/100 and product page drop-off fell within the first month.',
    author: 'Amina Farooq',
    role: 'Founder',
    company: 'Elora Botanicals',
    scope: 'Brand Identity · E-Commerce Web',
    metricValue: '0.7s',
    metricLabel: 'First paint · 99 Mobile Score',
    projectImage: GENERATED_MEDIA.eloraWeb,
  },
  {
    id: 'c2-couture',
    quote:
      'We needed an identity that spoke directly to bespoke menswear clients rather than generic tailoring ads. BRANDFIY crafted our monogram, woven packaging, and private fitting booking flow — increasing qualified consultation inquiries by 2.4x.',
    author: 'Rohan Nair',
    role: 'Creative Director',
    company: 'C2 Couture Atelier',
    scope: 'Monogram · Packaging · Web Lookbook',
    metricValue: '2.4x',
    metricLabel: 'Qualified fitting inquiries',
    projectImage: GENERATED_MEDIA.c2Branding,
  },
  {
    id: 'mirror-finish',
    quote:
      'Before working with BRANDFIY, prospective customers scrolled past our detailing posts without booking. Their high-contrast visual campaigns paired with interactive ceramic package booking lifted monthly studio bay reservations by 64%.',
    author: 'Tariq Al-Mansoor',
    role: 'Managing Partner',
    company: 'Mirror Finish Studio',
    scope: 'Creative Ads · Booking Platform',
    metricValue: '+64%',
    metricLabel: 'Studio bay reservations',
    projectImage: GENERATED_MEDIA.mirrorWeb,
  },
  {
    id: 'shay-tehran',
    quote:
      'Most diners discover us on their phones before ever walking in. BRANDFIY engineered our mobile menu experience, editorial food photography direction, and WhatsApp table reservations — multiplying online menu engagement by 3.2x.',
    author: 'Nadia Shirazi',
    role: 'Co-Founder',
    company: 'Shay Tehran Hospitality',
    scope: 'Digital Menu UX · Brand Storytelling',
    metricValue: '3.2x',
    metricLabel: 'Mobile menu views (82% mobile share)',
    projectImage: GENERATED_MEDIA.shayWeb,
  },
  {
    id: 'fly-retail',
    quote:
      'BRANDFIY unified our retail packaging, seasonal campaign posters, and Meta ad creatives under one clear voice. Instead of disconnected posts, our launch campaigns began returning consistent 4.8x ROAS across Instagram and display.',
    author: 'Faisal Rahman',
    role: 'Head of Brand',
    company: 'FLY Market Retail',
    scope: 'Retail Identity · Meta Ad Campaigns',
    metricValue: '4.8x',
    metricLabel: 'Verified campaign ROAS',
    projectImage: GENERATED_MEDIA.flyBranding,
  },
];
