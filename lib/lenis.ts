import type Lenis from 'lenis';
import type { MouseEvent } from 'react';

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToId(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el as HTMLElement, {
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.8 });
  } else {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export function handleAnchorClick(e: MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('#') || href.length < 2) return;
  if (!document.querySelector(href)) return;
  e.preventDefault();
  history.replaceState(null, '', href);
  scrollToId(href);
}
