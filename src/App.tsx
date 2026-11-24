/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeStrip } from './components/MarqueeStrip';
import { Manifesto } from './components/Manifesto';
import { Services } from './components/Services';
import { Pillars } from './components/Pillars';
import { PortfolioSection } from './components/PortfolioSection';
import { WebShowcase } from './components/WebShowcase';
import { StudioSection } from './components/StudioSection';
import { FaqSection } from './components/FaqSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { useGsapScrollReveal } from './hooks/useGsapScrollReveal';

export default function App() {
  const [heroReady, setHeroReady] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useGsapScrollReveal(mainRef, heroReady, {
    delay: 0.04,
    headingDelay: 0,
    revealDelay: 0.1,
    staggerDelay: 0.12,
    stagger: 0.075,
  });

  const handlePreloaderComplete = useCallback(() => {
    setHeroReady(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#31006B] text-white">
        <ScrollProgress />
        <CustomCursor />
        <Preloader onComplete={handlePreloaderComplete} />
        <Navbar />
        <main ref={mainRef} className="relative z-10">
          <Hero ready={heroReady} />
          <MarqueeStrip />
          <Manifesto />
          <Services />
          <Pillars />
          <PortfolioSection />
          <WebShowcase />
          <StudioSection />
          <FaqSection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
