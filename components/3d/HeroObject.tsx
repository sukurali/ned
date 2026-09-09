'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  isMobile: boolean;
  reduced: boolean;
};

const SOLAR = '#e8a33d';

type Ring = {
  radius: number;
  tube: number;
  tilt: [number, number, number];
  speed: number;
  accent: boolean;
};

const RINGS: Ring[] = [
  { radius: 1.95, tube: 0.02, tilt: [Math.PI / 2.3, 0, 0.35], speed: 0.28, accent: false },
  { radius: 2.35, tube: 0.012, tilt: [Math.PI / 1.75, 0.55, -0.3], speed: -0.18, accent: true },
  { radius: 2.8, tube: 0.008, tilt: [Math.PI / 2.9, -0.45, 0.2], speed: 0.12, accent: false },
];

const RING_SPEEDS = RINGS.map((r) => r.speed);

export default function HeroObject({ isMobile, reduced }: Props) {
  const pivot = useRef<THREE.Group>(null); // mouse + scroll transforms
  const spinner = useRef<THREE.Group>(null); // auto rotation
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const ringRefs = useRef<(THREE.Group | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const autoRot = useRef(0);

  const satellites = useMemo(() => {
    return new Array(5).fill(0).map((_, i) => {
      const a = (i / 5) * Math.PI * 2;
      const r = 2.35;
      return {
        key: i,
        position: [Math.cos(a) * r, Math.sin(a * 2) * 0.25, Math.sin(a) * r] as [number, number, number],
      };
    });
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const p = pivot.current;
    const s = spinner.current;
    if (!p || !s) return;

    const targetScale = isMobile ? 0.62 : 1;
    const targetX = isMobile ? 0 : 1.55; // object sits right of the headline on desktop
    const targetY = isMobile ? 0.35 : 0;

    if (!reduced) {
      autoRot.current += delta * 0.15;

      // scroll progress through the hero: the reactor rises and turns as you leave
      const hero = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      s.rotation.y = autoRot.current + hero * 1.4;

      p.rotation.x = THREE.MathUtils.damp(p.rotation.x, pointer.current.y * 0.14, 3, delta);
      p.rotation.z = THREE.MathUtils.damp(p.rotation.z, pointer.current.x * 0.05, 3, delta);
      p.position.y = THREE.MathUtils.damp(p.position.y, targetY + hero * 2.6, 3, delta);

      // camera parallax — layered with the group tilt for depth
      const cam = state.camera;
      cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 0.55, 2, delta);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, 0.15 - pointer.current.y * 0.4, 2, delta);
      cam.lookAt(isMobile ? 0 : 0.7, 0, 0);
    }

    // layout transitions (mobile <-> desktop) are damped, never snapped
    p.position.x = THREE.MathUtils.damp(p.position.x, targetX, 3, delta);
    const sc = THREE.MathUtils.damp(p.scale.x, targetScale, 3, delta);
    p.scale.setScalar(sc);

    // the heart breathes
    const pulse = reduced ? 0 : Math.sin(t * 1.6);
    if (coreRef.current) {
      coreRef.current.scale.setScalar(0.72 + pulse * 0.05);
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2.4 + pulse * 0.7;
    }
    if (wireRef.current) {
      const mat = wireRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.2 + pulse * 0.06;
    }

    // precessing rings + orbiting satellites
    if (!reduced) {
      ringRefs.current.forEach((g, i) => {
        if (g) g.rotation.y += delta * RING_SPEEDS[i];
      });
      if (orbitRef.current) orbitRef.current.rotation.y += delta * 0.32;
    }
  });

  return (
    <group
      ref={pivot}
      position={[isMobile ? 0 : 1.55, isMobile ? 0.35 : 0, 0]}
      scale={isMobile ? 0.62 : 1}
    >
      <group ref={spinner}>
        {/* glowing heart */}
        <mesh ref={coreRef} scale={0.72}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#2b1c08"
            emissive={SOLAR}
            emissiveIntensity={2.4}
            roughness={0.4}
            metalness={0}
            flatShading
            toneMapped={false}
          />
        </mesh>

        {/* faceted shell — real transmission glass on desktop, cheap alpha on mobile */}
        <mesh>
          <icosahedronGeometry args={[1.62, 1]} />
          {isMobile ? (
            <meshPhysicalMaterial
              color="#101318"
              metalness={0.9}
              roughness={0.32}
              transparent
              opacity={0.45}
              flatShading
            />
          ) : (
            <meshPhysicalMaterial
              transmission={1}
              thickness={1.4}
              roughness={0.22}
              ior={1.45}
              color="#ffffff"
              attenuationColor={SOLAR}
              attenuationDistance={3.2}
              clearcoat={0.4}
              clearcoatRoughness={0.3}
              envMapIntensity={1.2}
              flatShading
            />
          )}
        </mesh>

        {/* amber wireframe accent */}
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.66, 1]} />
          <meshBasicMaterial color={SOLAR} wireframe transparent opacity={0.2} />
        </mesh>

        {/* orbital rings */}
        {RINGS.map((r, i) => (
          <group
            key={r.radius}
            ref={(g) => {
              ringRefs.current[i] = g;
            }}
            rotation={r.tilt}
          >
            <mesh>
              <torusGeometry args={[r.radius, r.tube, 8, 96]} />
              {r.accent ? (
                <meshStandardMaterial
                  color={SOLAR}
                  emissive={SOLAR}
                  emissiveIntensity={0.7}
                  metalness={0.6}
                  roughness={0.3}
                />
              ) : (
                <meshStandardMaterial color="#c9ccd4" metalness={1} roughness={0.25} envMapIntensity={1.4} />
              )}
            </mesh>
          </group>
        ))}

        {/* satellites riding the accent ring's plane */}
        <group ref={orbitRef} rotation={[Math.PI / 1.75, 0.55, -0.3]}>
          {satellites.map((s) => (
            <mesh key={s.key} position={s.position}>
              <octahedronGeometry args={[0.07, 0]} />
              <meshStandardMaterial color="#d7dae2" metalness={1} roughness={0.2} envMapIntensity={1.5} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
