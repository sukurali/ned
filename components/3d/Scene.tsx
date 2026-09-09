'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import HeroObject from './HeroObject';
import Particles from './Particles';
import { gsap } from '@/lib/gsap';
import { onIntroDone } from '@/lib/intro';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function Scene() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null); // intro fade
  const innerRef = useRef<HTMLDivElement>(null); // scroll-driven presence

  // fade the scene in as the preloader curtain lifts
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    if (reduced) {
      gsap.set(outer, { autoAlpha: 1 });
      return;
    }
    gsap.set(outer, { autoAlpha: 0 });
    const off = onIntroDone(() => {
      gsap.to(outer, { autoAlpha: 1, duration: 1.8, ease: 'power2.out' });
    });
    return () => {
      off();
      gsap.set(outer, { clearProps: 'opacity,visibility' });
    };
  }, [reduced]);

  // scroll choreography: full presence in the hero, a whisper behind the
  // intro copy, hidden through the dense middle sections, back for the finale
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const ctx = gsap.context(() => {
      gsap.to(inner, {
        opacity: 0.22,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: '#experience', start: 'top bottom', end: 'top top', scrub: true },
      });
      gsap.to(inner, {
        opacity: 0,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: '#features', start: 'top bottom', end: 'top 30%', scrub: true },
      });
      gsap.to(inner, {
        opacity: 0.45,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: '#cta', start: 'top bottom', end: 'top 45%', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-0">
      <div ref={innerRef} className="h-full w-full">
        <Canvas
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ position: [0, 0.15, 7], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={['#08080a', 10, 30]} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[5, 6, 4]} intensity={1.4} color="#ffedd2" />
            <pointLight position={[-6, -3, -4]} intensity={18} distance={22} color="#7d9cb8" />
            <pointLight position={[0, 0.5, 3]} intensity={26} distance={14} color="#e8a33d" />

            <HeroObject isMobile={isMobile} reduced={reduced} />
            <Particles count={isMobile ? 350 : 850} reduced={reduced} />

            {/* fully procedural environment — no external HDR to fetch */}
            <Environment resolution={256} frames={1}>
              <Lightformer form="rect" intensity={3} color="#fff2dd" position={[-4, 2.5, 2]} scale={[5, 5, 1]} />
              <Lightformer form="rect" intensity={1.4} color="#8fb0c8" position={[4, -1.5, 2.5]} scale={[4, 4, 1]} />
              <Lightformer form="circle" intensity={2.2} color="#e8a33d" position={[0, 4, -3]} scale={[3, 3, 1]} />
              <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, -4, 1]} scale={[6, 2, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
