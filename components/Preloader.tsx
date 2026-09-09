'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { markIntroDone } from '@/lib/intro';
import { getLenis } from '@/lib/lenis';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) {
      markIntroDone();
      setVisible(false);
      return;
    }

    getLenis()?.stop();
    document.body.style.overflow = 'hidden';

    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        document.body.style.overflow = '';
        getLenis()?.start();
      },
    });

    tl.to(counter, {
      v: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
        }
      },
    })
      .to(barRef.current, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, '<')
      .to(contentRef.current, { opacity: 0, y: -24, duration: 0.45, ease: 'power2.in' }, '+=0.2')
      .to(
        rootRef.current,
        { yPercent: -100, duration: 0.9, ease: 'power4.inOut', onStart: markIntroDone },
        '-=0.15',
      );

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#0a0a0d] p-6 md:p-10"
    >
      <div ref={contentRef} className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-bone/40">
          <span>NOVA — SPATIAL STUDIO</span>
          <span className="hidden sm:block">EST. 2025</span>
        </div>
        <div className="flex items-end justify-between gap-6">
          <span className="mb-3 font-mono text-[10px] tracking-[0.3em] text-bone/40">
            LOADING EXPERIENCE
          </span>
          <span className="font-sans text-[24vw] font-medium leading-[0.8] tracking-[-0.04em] text-bone md:text-[15vw]">
            <span ref={counterRef}>000</span>
            <span className="text-solar">%</span>
          </span>
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-solar" />
      </div>
    </div>
  );
}
