'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp, Dribbble, Github, Twitter } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { handleAnchorClick, scrollToTop } from '@/lib/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const SITEMAP = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#experience' },
  { label: 'Features', href: '#features' },
  { label: 'Technology', href: '#technology' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: Dribbble },
];

export default function Footer() {
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
        scrollTrigger: { trigger: root, start: 'top 85%', once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer id="contact" ref={rootRef} className="relative z-10 border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div data-reveal className="md:col-span-6">
            <a
              href="#home"
              onClick={handleAnchorClick}
              className="flex items-center gap-3"
              aria-label="NOVA — back to top"
            >
              <span aria-hidden="true" className="block h-3 w-3 rotate-45 border border-solar" />
              <span className="font-sans text-lg font-medium tracking-[0.25em] text-bone">NOVA</span>
            </a>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/50">
              An independent studio crafting the spatial web. We design and build
              immersive experiences that feel like the future — because they are.
            </p>
          </div>

          <nav aria-label="Footer" data-reveal className="md:col-span-3">
            <h2 className="font-mono text-[10px] tracking-[0.35em] text-bone/35">SITEMAP</h2>
            <ul className="mt-5 space-y-3">
              {SITEMAP.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={handleAnchorClick}
                    className="text-sm text-bone/60 transition-colors hover:text-solar"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-reveal className="md:col-span-3">
            <h2 className="font-mono text-[10px] tracking-[0.35em] text-bone/35">CONNECT</h2>
            <a
              href="mailto:hello@nova.studio"
              className="mt-5 block text-sm text-bone/60 transition-colors hover:text-solar"
            >
              hello@nova.studio
            </a>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-bone/60 transition-colors duration-300 hover:border-solar/60 hover:text-solar"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-white/5 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] tracking-[0.25em] text-bone/30">
            © 2025 NOVA STUDIO — ALL RIGHTS RESERVED
          </p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-bone/30">
            DESIGNED IN ORBIT / BUILT ON EARTH
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-bone/50 transition-colors hover:text-solar"
          >
            BACK TO TOP
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
