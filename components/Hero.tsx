'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';
import { handleAnchorClick } from '@/lib/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import Magnetic from '@/components/ui/Magnetic';

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = Array.from(root.querySelectorAll('[data-line]'));
    const fades = Array.from(root.querySelectorAll('[data-fade]'));

    if (reduced) return; // markup is visible by default

    gsap.set(lines, { yPercent: 115 });
    gsap.set(fades, { opacity: 0, y: 26 });

    let tl: gsap.core.Timeline | null = null;
    const off = onIntroDone(() => {
      tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(lines, { yPercent: 0, duration: 1.25, stagger: 0.14 })
        .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, '-=0.65');
    });

    return () => {
      off();
      tl?.kill();
      gsap.set([...lines, ...fades], { clearProps: 'opacity,transform' });
    };
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* legibility scrims over the fixed 3D scene — text always wins */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,10,0.72),transparent_72%)] md:hidden" />
      <div aria-hidden="true" className="absolute inset-0 hidden md:block md:bg-[linear-gradient(90deg,rgba(8,8,10,0.82)_0%,rgba(8,8,10,0.35)_45%,transparent_72%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:px-10">
        <div className="max-w-2xl">
          <div data-fade className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-solar" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-bone/70">THE FUTURE IS 3D</span>
          </div>

          <h1 className="mt-8 font-sans text-[clamp(3.2rem,9vw,7.5rem)] font-medium leading-[0.93] tracking-[-0.03em] text-bone">
            <span className="block overflow-hidden pb-1">
              <span data-line className="block">BUILD BEYOND</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-line className="block">
                THE ORDINARY<span className="text-solar">.</span>
              </span>
            </span>
          </h1>

          <p data-fade className="mt-8 max-w-md text-base leading-relaxed text-bone/60 md:text-lg">
            Experience a new generation of digital experiences where design, technology
            and immersive 3D come together.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#experience"
                onClick={handleAnchorClick}
                className="group inline-flex items-center gap-3 rounded-full bg-solar px-7 py-4 font-mono text-[11px] tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-bone"
              >
                EXPLORE EXPERIENCE
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#showcase"
                onClick={handleAnchorClick}
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 font-mono text-[11px] tracking-[0.22em] text-bone/80 transition-colors duration-300 hover:border-solar hover:text-solar"
              >
                VIEW PROJECT
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div data-fade className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.4em] text-bone/40">SCROLL</span>
        <span className="block h-12 w-px bg-white/10">
          <span className="block h-full w-full animate-scroll-line bg-solar" />
        </span>
      </div>

      {/* corner meta */}
      <div data-fade className="absolute bottom-8 right-10 z-10 hidden text-right font-mono text-[10px] leading-relaxed tracking-[0.25em] text-bone/35 lg:block">
        <p>FIELD 07 — SPATIAL WEB</p>
        <p>37.77°N / 122.42°W</p>
      </div>
    </section>
  );
}
