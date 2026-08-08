"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const BLUE = new THREE.Color(0x4a8fff);
const GOLD = new THREE.Color(0xffcf4a);
const MAX_HEIGHT = 3.4;
const MIN_HEIGHT = 0.5;
const COLOR_MILESTONE_HOURS = 60;
const RING_EVERY_HOURS = 12;
const MAX_RINGS = 5;

function heightFor(hours: number): number {
  // sqrt growth so the pillar keeps visibly rising without going off-frame
  // for large totals — a real, monotonic function of the actual hours
  // total, not a decorative animation unrelated to the real number.
  const t = Math.min(1, Math.sqrt(hours) / Math.sqrt(120));
  return MIN_HEIGHT + t * (MAX_HEIGHT - MIN_HEIGHT);
}

function colorFor(hours: number): THREE.Color {
  const t = Math.min(1, hours / COLOR_MILESTONE_HOURS);
  return new THREE.Color().lerpColors(BLUE, GOLD, t);
}

function ringCountFor(hours: number): number {
  return Math.min(MAX_RINGS, Math.floor(hours / RING_EVERY_HOURS));
}

interface HoursMonolithSceneProps {
  totalHours: number;
}

export function HoursMonolithScene({ totalHours }: HoursMonolithSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetHeightRef = useRef(heightFor(totalHours));
  const targetColorRef = useRef(colorFor(totalHours));
  const rebuildRingsRef = useRef<(count: number) => void>(() => {});

  // Scene/renderer/controls setup — runs once. The always-running rAF loop
  // reads targetHeightRef/targetColorRef every frame, so later prop changes
  // (handled in the effect below) reach it without tearing the scene down.
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    const container: HTMLDivElement = containerEl;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(2.4, 1.6, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const key = new THREE.PointLight(0xffffff, 30);
    key.position.set(2, 3, 2);
    scene.add(ambient, key);

    const pillarGeometry = new THREE.CylinderGeometry(0.32, 0.4, 1, 6, 1);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: BLUE.clone(),
      metalness: 0.35,
      roughness: 0.25,
      flatShading: true,
    });
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    scene.add(pillar);

    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    let ringMeshes: THREE.Points[] = [];

    function buildRings(count: number) {
      for (const mesh of ringMeshes) {
        ringGroup.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
      ringMeshes = [];
      for (let i = 0; i < count; i++) {
        const particleCount = 28;
        const positions = new Float32Array(particleCount * 3);
        const radius = 0.55 + i * 0.16;
        for (let p = 0; p < particleCount; p++) {
          const angle = (p / particleCount) * Math.PI * 2;
          positions[p * 3] = Math.cos(angle) * radius;
          positions[p * 3 + 1] = 0;
          positions[p * 3 + 2] = Math.sin(angle) * radius;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
          size: 0.05,
          color: GOLD.clone(),
          transparent: true,
          opacity: 0.85,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geometry, material);
        ringMeshes.push(points);
        ringGroup.add(points);
      }
    }
    rebuildRingsRef.current = buildRings;
    buildRings(ringCountFor(totalHours));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.6, 0);

    function resize() {
      const rect = container.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let currentHeight = MIN_HEIGHT;
    const currentColor = BLUE.clone();
    let frameId = 0;
    let t = 0;

    function animate() {
      t += 0.016;
      currentHeight += (targetHeightRef.current - currentHeight) * 0.06;
      currentColor.lerp(targetColorRef.current, 0.05);

      pillar.scale.y = currentHeight;
      pillar.position.y = currentHeight / 2;
      pillarMaterial.color.copy(currentColor);

      ringGroup.children.forEach((mesh, i) => {
        mesh.position.y = currentHeight * (0.4 + i * 0.12);
        mesh.rotation.y = t * (i % 2 === 0 ? 0.3 : -0.25);
      });

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      pillarGeometry.dispose();
      pillarMaterial.dispose();
      for (const mesh of ringMeshes) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
    };
    // Scene/renderer/controls are created once; totalHours-driven updates
    // are pushed through the refs below instead of tearing this down.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reactive to totalHours — updates the refs the running rAF loop reads,
  // and rebuilds the ring geometry when the ring count actually changes.
  useEffect(() => {
    targetHeightRef.current = heightFor(totalHours);
    targetColorRef.current = colorFor(totalHours);
    rebuildRingsRef.current(ringCountFor(totalHours));
  }, [totalHours]);

  return <div ref={containerRef} className="h-56 w-full" />;
}
