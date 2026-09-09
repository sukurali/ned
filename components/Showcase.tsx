'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import SectionLabel from '@/components/ui/SectionLabel';

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: string;
  tags: string[];
  seed: string;
};

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'AETHER OS',
    subtitle: 'Spatial operating interface',
    year: '2025',
    seed: 'nova-aether',
    tags: ['WEBGL', 'UI SYSTEM', 'DESIGN ENGINEERING'],
    description:
      'A spatial operating layer for mixed reality — windows with real depth, physics and occlusion, rendered in the browser at a locked 90fps.',
  },
  {
    id: '02',
    title: 'LUMEN FIELD',
    subtitle: 'Generative light installation',
    year: '2024',
    seed: 'nova-lumen',
    tags: ['THREE.JS', 'GLSL', 'AUDIO-REACTIVE'],
    description:
      'A generative light field streaming audio-reactive shaders to forty thousand visitors a night. No app, no install — just a URL.',
  },
  {
    id: '03',
    title: 'ORBITAL',
    subtitle: 'Real-time product configurator',
    year: '2024',
    seed: 'nova-orbital',
    tags: ['R3F', 'E-COMMERCE', 'PBR'],
    description:
      'A physically-based 3D configurator where customers rotate, dissect and personalize the product before buying. Conversion doubled.',
  },
];

export default function Showcase() {
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
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      });

      gsap.utils.toArray<HTMLElement>('[data-project]', root).forEach((el) => {
        gsap.from(el, {
          y: 90,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      // scroll-scrubbed depth: the image drifts inside its frame
      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((el) => {
        const trig = el.closest('[data-project]') ?? el;
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="showcase" ref={rootRef} className="relative z-10 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <div data-reveal>
          <SectionLabel index="03" title="SELECTED WORK" />
        </div>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2
            data-reveal
            className="font-sans text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.02em] text-bone"
          >
            Work that <span className="text-solar">moves</span> people.
          </h2>
          <p data-reveal className="font-mono text-[10px] tracking-[0.3em] text-bone/35">
            A FEW PIECES FROM THE LAST ORBIT — 2024 / 2025
          </p>
        </div>

        <div className="mt-16 md:mt-24">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              data-project
              className={`grid items-center gap-10 md:grid-cols-12 ${i > 0 ? 'mt-24 md:mt-36' : ''}`}
            >
              <div className={`md:col-span-7 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-coal">
                  <div data-parallax className="absolute -inset-y-[10%] inset-x-0">
                    <Image
                      src={`https://picsum.photos/seed/${p.seed}/1400/1000.jpg`}
                      alt={`${p.title} — ${p.subtitle}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      quality={80}
                      className="object-cover brightness-[0.85] saturate-[0.85] transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:brightness-100 group-hover:saturate-100"
                    />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/60 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-bone/70 backdrop-blur-sm">
                    {p.id} / {p.year}
                  </span>
                </div>
              </div>

              <div className={`md:col-span-5 ${i % 2 === 1 ? 'md:order-1 md:text-right' : ''}`}>
                <p className="font-mono text-[10px] tracking-[0.3em] text-solar">
                  {p.subtitle.toUpperCase()}
                </p>
                <h3 className="mt-3 font-sans text-3xl font-medium tracking-tight text-bone md:text-5xl">
                  {p.title}
                </h3>
                <p className={`mt-4 max-w-md text-sm leading-relaxed text-bone/55 ${i % 2 === 1 ? 'md:ml-auto' : ''}`}>
                  {p.description}
                </p>
                <ul className={`mt-6 flex flex-wrap gap-2 ${i % 2 === 1 ? 'md:justify-end' : ''}`}>
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[9px] tracking-[0.25em] text-bone/50"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://picsum.photos/seed/${p.seed}/1920/1280.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-bone/70 transition-colors hover:text-solar"
                >
                  VIEW CASE
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
