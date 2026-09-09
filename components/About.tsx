'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionLabel from '@/components/ui/SectionLabel';

const META = [
  ['EST.', '2025'],
  ['BASE', 'SF — TOKYO'],
  ['FOCUS', 'SPATIAL WEB'],
];

export default function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-line]', {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
      gsap.from('[data-reveal]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 60%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="experience" ref={rootRef} className="relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-44">
        <div data-reveal>
          <SectionLabel index="01" title="THE STUDIO" />
        </div>

        <h2 className="mt-10 max-w-5xl font-sans text-[clamp(1.7rem,4.4vw,3.7rem)] font-light leading-[1.12] tracking-[-0.015em] text-bone">
          <span className="block overflow-hidden pb-2">
            <span data-line className="block">We craft digital worlds</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-line className="block">where design and code</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-line className="block">bend into one —</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-line className="block">and the screen becomes</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-line className="block">
              a place you can <span className="font-medium text-solar">enter</span>.
            </span>
          </span>
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <p data-reveal className="max-w-md text-sm leading-relaxed text-bone/55 md:col-span-5">
            NOVA is an independent studio working at the intersection of design,
            real-time 3D and modern web engineering. We prototype in the browser,
            obsess over motion, and ship experiences people actually remember.
          </p>

          <div data-reveal className="grid grid-cols-3 gap-6 md:col-span-5 md:col-start-8">
            {META.map(([k, v]) => (
              <div key={k} className="border-l border-white/10 pl-4">
                <p className="font-mono text-[10px] tracking-[0.25em] text-bone/35">{k}</p>
                <p className="mt-2 font-mono text-xs tracking-[0.2em] text-bone/70">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
