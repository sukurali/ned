'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionLabel from '@/components/ui/SectionLabel';

const STATS = [
  { target: 99, final: '99%', label: 'PERFORMANCE' },
  { target: 24, final: '24/7', label: 'AVAILABILITY' },
  { target: 3, final: '3D', label: 'IMMERSIVE' },
  { target: null, final: '∞', label: 'POSSIBILITIES' },
];

export default function Stats() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (reduced) return; // markup already shows final values

      gsap.from('[data-anim]', {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      });

      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const final = el.dataset.final ?? '';
        const obj = { v: 0 };

        ScrollTrigger.create({
          trigger: root,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            el.textContent = '0';
            gsap.to(obj, {
              v: target,
              duration: 1.8,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent =
                  Math.round(obj.v) === target ? final : String(Math.round(obj.v));
              },
            });
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative z-10 border-y border-white/5 bg-ink">
      <h2 className="sr-only">Studio statistics</h2>
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div data-anim>
          <SectionLabel index="05" title="IN NUMBERS" />
        </div>

        <div className="mt-12 grid grid-cols-2 md:mt-16 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              data-anim
              className={[
                'flex flex-col gap-3 border-white/10 py-8 md:py-4 md:px-8',
                i % 2 === 1 ? 'border-l pl-6' : '',
                i >= 2 ? 'border-t md:border-t-0' : '',
                i >= 2 ? 'md:border-l' : '',
                i === 0 ? 'md:pl-0' : '',
              ].join(' ')}
            >
              <dd
                data-count={s.target ?? undefined}
                data-final={s.final}
                className="font-sans text-5xl font-medium tracking-tight text-bone md:text-6xl"
              >
                {s.final}
              </dd>
              <dt className="font-mono text-[10px] tracking-[0.3em] text-bone/40">{s.label}</dt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
