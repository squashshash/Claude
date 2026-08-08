"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Self-contained value-noise field (no external glsl-noise dependency) —
// flows two offset fields together for a "liquid" look, then bakes a
// chromatic fringe directly into the fragment shader by resampling the
// field at slightly shifted coordinates per color channel. Plain Three.js
// (no @react-three/fiber) — this project's exact Next.js/React combo has a
// reproducible react-reconciler incompatibility with fiber's Canvas, so
// the scene is managed imperatively instead.
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return value;
  }

  vec3 deep = vec3(0.05, 0.035, 0.02);
  vec3 mid = vec3(0.22, 0.14, 0.08);
  vec3 glow = vec3(0.25, 0.85, 0.55);

  // One ramp (deep brown -> amber -> green glow), sampled at a given point —
  // every channel of the final color comes from THIS same ramp, just at a
  // spatially offset point per channel (see main()). Never blending
  // independently-sourced channel values, which previously let R and B
  // drift toward glow's values while G stayed near deep, producing
  // off-palette purple/magenta at some pixels instead of a true fringe.
  vec3 rampAt(vec2 p) {
    float n = fbm(p);
    vec3 c = mix(deep, mid, smoothstep(0.2, 0.85, n));
    c = mix(c, glow, smoothstep(0.78, 1.0, n) * 0.55);
    return c;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.05;
    vec2 flow = vec2(fbm(uv * 3.0 + t), fbm(uv * 3.0 - t + 4.2));
    vec2 base = uv * 2.2 + flow * 1.4 + t;

    vec3 cR = rampAt(base + vec2(0.01, 0.0));
    vec3 cG = rampAt(base);
    vec3 cB = rampAt(base - vec2(0.01, 0.0));

    vec3 color = vec3(cR.r, cG.g, cB.b);
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WebglLiquidSceneProps {
  effects?: boolean;
}

export function WebglLiquidScene({ effects: _effects = true }: WebglLiquidSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    function resize() {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth || 1, clientHeight || 1, false);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frameId = 0;
    const clock = new THREE.Clock();
    function animate() {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
