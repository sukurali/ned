'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { scrollToTop } from '@/lib/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import Magnetic from '@/components/ui/Magnetic';
import SectionLabel from '@/components/ui/SectionLabel';

export default function CTA() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-cta-line]', {
        yPercent: 115,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
      gsap.from('[data-cta-fade]', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 55%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="cta"
      ref={rootRef}
      className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,10,0.6),transparent_70%)]" />

      <div data-cta-fade className="relative">
        <SectionLabel index="06" title="TRANSMISSION" />
      </div>

      <h2 className="relative mt-10 font-sans text-[clamp(2.8rem,9vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-bone">
        <span className="block overflow-hidden pb-1">
          <span data-cta-line className="block">READY TO ENTER</span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span data-cta-line className="block">
            THE FUTURE<span className="text-solar">?</span>
          </span>
        </span>
      </h2>

      <div data-cta-fade className="relative mt-14">
        <Magnetic strength={0.45}>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-4 rounded-full border border-solar/60 px-10 py-5 font-mono text-xs tracking-[0.3em] text-solar transition-colors duration-300 hover:bg-solar hover:text-ink md:px-14 md:py-6"
          >
            START EXPERIENCE
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </Magnetic>
      </div>

      <p data-cta-fade className="relative mt-10 font-mono text-[10px] tracking-[0.3em] text-bone/35">
        NO ACCOUNTS. NO DOWNLOADS. JUST THE BROWSER.
      </p>
    </section>
  );
}
