'use client';

import { useEffect, useRef } from 'react';
import { Cpu, MousePointerClick, Orbit, Zap, type LucideIcon } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionLabel from '@/components/ui/SectionLabel';

type Feature = {
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    index: '01',
    title: 'IMMERSIVE',
    description: 'Cinematic scenes with real depth, atmosphere and lighting — spaces people feel before they read.',
    icon: Orbit,
  },
  {
    index: '02',
    title: 'INTERACTIVE',
    description: 'Every surface responds. Pointer physics, parallax and magnetic motion make the interface feel alive.',
    icon: MousePointerClick,
  },
  {
    index: '03',
    title: 'REAL-TIME',
    description: 'Sixty frames per second in the browser. No plugins, no installs, no compromise on craft.',
    icon: Zap,
  },
  {
    index: '04',
    title: 'NEXT-GEN',
    description: 'Built on the modern spatial web stack — ready for the internet that comes after the flat one.',
    icon: Cpu,
  },
];

export default function Features() {
  const rootRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('[data-card]', {
          y: 70,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 75%', once: true },
        });
        gsap.from('[data-reveal]', {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });
      }
    }, root);

    // 3D tilt — fine pointers only (phones keep native tap behavior)
    const cleanups: Array<() => void> = [];
    if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      cardsRef.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { transformPerspective: 900 });
        const rX = gsap.quickTo(el, 'rotationX', { duration: 0.7, ease: 'power3' });
        const rY = gsap.quickTo(el, 'rotationY', { duration: 0.7, ease: 'power3' });
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          rY(((e.clientX - r.left) / r.width - 0.5) * 7);
          rX(-((e.clientY - r.top) / r.height - 0.5) * 7);
        };
        const onLeave = () => {
          rX(0);
          rY(0);
        };
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
          gsap.set(el, { rotationX: 0, rotationY: 0 });
        });
      });
    }

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [reduced]);

  return (
    <section id="features" ref={rootRef} className="relative z-10 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <div data-reveal>
          <SectionLabel index="02" title="CAPABILITIES" />
        </div>
        <h2
          data-reveal
          className="mt-10 font-sans text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.02em] text-bone"
        >
          Engineered to feel <span className="text-solar">effortless</span>.
        </h2>

        {/* asymmetric 2x2 grid: cards 2 and 4 sit lower for an editorial rhythm */}
        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 md:gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <article
                key={f.index}
                data-card
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors duration-500 hover:border-solar/40 hover:bg-white/[0.05] md:p-10 ${
                  i % 2 === 1 ? 'md:translate-y-14' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-solar transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-[0.25em] text-bone/40">/{f.index}</span>
                  <Icon className="h-6 w-6 text-bone/40 transition-colors duration-500 group-hover:text-solar" strokeWidth={1.5} />
                </div>
                <h3 className="mt-16 font-sans text-2xl font-medium tracking-tight text-bone md:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/55">{f.description}</p>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-8 -right-4 select-none font-sans text-[7rem] font-medium leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-solar/10"
                >
                  {f.index}
                </span>
              </article>
            );
          })}
        </div>
        <div aria-hidden="true" className="hidden md:block md:h-14" />
      </div>
    </section>
  );
}
