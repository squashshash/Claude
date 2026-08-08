"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COUNT = 120;
const GRAVITY = 2.2;
const LIFETIME = 1.1;

interface CelebrationBurstSceneProps {
  onDone: () => void;
}

export function CelebrationBurstScene({ onDone }: CelebrationBurstSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1.6, 1.6, 1.6, -1.6, 0, 10);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
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

    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.8;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.sin(angle) * speed + 1.4;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x5be9a8,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let frameId = 0;
    let elapsed = 0;
    let lastTime = performance.now();
    let done = false;

    function animate() {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      elapsed += delta;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        posAttr.setX(i, velocities[i * 3] * elapsed);
        posAttr.setY(i, velocities[i * 3 + 1] * elapsed - 0.5 * GRAVITY * elapsed * elapsed);
        posAttr.setZ(i, velocities[i * 3 + 2] * elapsed);
      }
      posAttr.needsUpdate = true;
      material.opacity = Math.max(0, 1 - elapsed / LIFETIME);

      renderer.render(scene, camera);

      if (elapsed >= LIFETIME) {
        if (!done) {
          done = true;
          onDoneRef.current();
        }
        return;
      }
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
