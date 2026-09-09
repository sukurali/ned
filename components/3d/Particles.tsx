'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  count: number;
  reduced: boolean;
};

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute float aSpeed;
  varying float vFade;

  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * aSpeed + position.x * 1.5) * 0.28;
    pos.x += cos(uTime * aSpeed * 0.6 + position.z) * 0.18;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (uSize * aScale) / max(-mv.z, 0.001);
    vFade = clamp((26.0 + mv.z) / 20.0, 0.05, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.1, 0.5, d);
    gl_FragColor = vec4(uColor, strength * vFade * uOpacity);
  }
`;

export default function Particles({ count, reduced }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // radius biased outward: near ones read as particles, far ones as stars
      const r = 4 + Math.pow(Math.random(), 1.6) * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = Math.random() * 1.4 + 0.4;
      speeds[i] = Math.random() * 0.8 + 0.2;
    }
    return { positions, scales, speeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 30 },
      uColor: { value: new THREE.Color('#e9c998') },
      uOpacity: { value: 0.75 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      // keep point size consistent across device pixel ratios
      matRef.current.uniforms.uSize.value = 30 * state.gl.getPixelRatio();
      if (!reduced) {
        matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      }
    }
    if (!reduced && pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
