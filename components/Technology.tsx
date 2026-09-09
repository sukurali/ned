'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionLabel from '@/components/ui/SectionLabel';

const TECH = [
  { name: 'THREE.JS', role: 'RENDERING ENGINE', version: 'R169' },
  { name: 'WEBGL', role: 'GPU PIPELINE', version: '2.0' },
  { name: 'REACT', role: 'UI RUNTIME', version: '18' },
  { name: 'NEXT.JS', role: 'APPLICATION FRAMEWORK', version: '14' },
  { name: 'TYPESCRIPT', role: 'TYPE SYSTEM', version: '5' },
];

const MARQUEE = [
  'REAL-TIME RENDERING',
  'GLSL SHADERS',
  'SPATIAL DESIGN',
  '60 FPS',
  'WEBGPU READY',
  'PBR MATERIALS',
  'MOTION SYSTEMS',
  'ZERO PLUGINS',
];

export default function Technology() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      });
      gsap.from('[data-row]', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '[data-rows]', start: 'top 78%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="technology" ref={rootRef} className="relative z-10 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <div data-reveal>
          <SectionLabel index="04" title="THE STACK" />
        </div>
        <h2
          data-reveal
          className="mt-10 font-sans text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.02em] text-bone"
        >
          Serious machinery<span className="text-solar">.</span>
        </h2>

        <div data-reveal className="mt-14 overflow-hidden border-y border-white/5 py-5">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((half) => (
              <div key={half} className="flex items-center gap-10 pr-10" aria-hidden={half === 1}>
                {MARQUEE.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-10 whitespace-nowrap font-mono text-[10px] tracking-[0.35em] text-bone/30"
                  >
                    {item}
                    <span className="text-solar/50">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <ul data-rows className="mt-4">
          {TECH.map((t, i) => (
            <li key={t.name} data-row className="group relative border-t border-white/10 last:border-b">
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-white/[0.025] transition-transform duration-500 ease-out group-hover:scale-y-100"
              />
              <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-6 py-7 md:gap-10 md:py-9">
                <span className="font-mono text-xs text-bone/30 md:text-sm">0{i + 1}</span>
                <h3 className="font-sans text-[clamp(2rem,6vw,4.6rem)] font-medium leading-none tracking-[-0.02em] text-bone/85 transition-all duration-500 group-hover:translate-x-3 group-hover:text-bone md:group-hover:translate-x-5">
                  {t.name}
                </h3>
                <div className="flex items-center gap-6">
                  <span className="hidden font-mono text-[10px] tracking-[0.3em] text-bone/35 md:block">
                    {t.role}
                  </span>
                  <span className="hidden rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-bone/50 sm:block">
                    {t.version}
                  </span>
                  <ArrowUpRight
                    className="h-6 w-6 text-bone/20 opacity-0 transition-all duration-500 group-hover:text-solar group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
