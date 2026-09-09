'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';
import { getLenis, handleAnchorClick, scrollToId } from '@/lib/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const LINKS = [
  { label: 'HOME', href: '#home' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'FEATURES', href: '#features' },
  { label: 'TECHNOLOGY', href: '#technology' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const rootRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // entrance: drops in as the preloader curtain lifts
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.set(root, { y: -28, opacity: 0 });
    const off = onIntroDone(() => {
      gsap.to(root, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 });
    });
    return () => {
      off();
      gsap.set(root, { clearProps: 'all' });
    };
  }, [reduced]);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }
  }, [open]);

  const onMenuLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(href), 80);
  };

  return (
    <header ref={rootRef} className="fixed inset-x-0 top-0 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fmReduced ? 0 : 0.3 }}
            className="fixed inset-0 bg-ink/95 backdrop-blur-2xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex h-full flex-col justify-center overflow-y-auto px-8 py-24">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: fmReduced ? 0 : 0.5, ease: 'easeOut' }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => onMenuLinkClick(e, l.href)}
                    className="block py-3 font-sans text-4xl font-medium tracking-tight text-bone/90 transition-colors hover:text-solar"
                  >
                    <span className="mr-4 font-mono text-xs text-solar">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.div>
              ))}
              <motion.a
                href="#cta"
                onClick={(e) => onMenuLinkClick(e, '#cta')}
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: fmReduced ? 0 : 0.5, ease: 'easeOut' }}
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-solar/50 px-6 py-3 font-mono text-[11px] tracking-[0.3em] text-solar"
              >
                LAUNCH
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4 backdrop-blur-md transition-colors duration-500 md:px-10 ${
          scrolled ? 'border-b border-white/5 bg-ink/70' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a href="#home" onClick={handleAnchorClick} className="flex items-center gap-3" aria-label="NOVA — back to top">
          <span aria-hidden="true" className="block h-3 w-3 rotate-45 border border-solar" />
          <span className="font-sans text-lg font-medium tracking-[0.25em] text-bone">NOVA</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleAnchorClick}
              className="font-mono text-[10px] tracking-[0.3em] text-bone/55 transition-colors duration-300 hover:text-bone"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#cta"
            onClick={handleAnchorClick}
            className="ml-4 inline-flex items-center gap-2 rounded-full border border-solar/50 px-5 py-2.5 font-mono text-[10px] tracking-[0.3em] text-solar transition-colors duration-300 hover:bg-solar hover:text-ink"
          >
            LAUNCH
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-bone md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
