"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface TimelineItem {
  id: string;
  label: string;
  date: string;
  kind: "exam" | "class";
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}

// Renders the card's two text lines to a 2D canvas and uses it as a plane's
// texture — a lightweight way to get crisp labels in a 3D scene without a
// text-layout library (drei's Text/troika) that this project's Next.js +
// React combo can't currently load (see webgl-liquid-scene.tsx's header).
function makeLabelTexture(title: string, subtitle: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#04140d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = "700 40px Inter, sans-serif";
  const truncated = title.length > 26 ? `${title.slice(0, 24)}…` : title;
  ctx.fillText(truncated, canvas.width / 2, 62);
  ctx.fillStyle = "#f8ecd9";
  ctx.font = "400 28px Inter, sans-serif";
  ctx.fillText(subtitle, canvas.width / 2, 112);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function urgencyColor(days: number): number {
  if (days < 0) return 0x8a8578;
  if (days <= 7) return 0xff5c5c;
  if (days <= 30) return 0xffcf4a;
  return 0x4a8fff;
}

// A real hourglass silhouette (revolved profile), not a decorative
// primitive — two bulbs pinched at a neck.
function hourglassGeometry(): THREE.LatheGeometry {
  const points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.3, 0.02),
    new THREE.Vector2(0.3, 0.13),
    new THREE.Vector2(0.045, 0.42),
    new THREE.Vector2(0.045, 0.5),
    new THREE.Vector2(0.3, 0.79),
    new THREE.Vector2(0.3, 0.9),
    new THREE.Vector2(0, 0.92),
  ];
  return new THREE.LatheGeometry(points, 24);
}

interface Schedule3DSceneProps {
  items: TimelineItem[];
}

export function Schedule3DScene({ items }: Schedule3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sorted = useMemo(() => items.slice().sort((a, b) => a.date.localeCompare(b.date)), [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || sorted.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.35, 1.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const point = new THREE.PointLight(0x7dffcf, 35);
    point.position.set(2, 2, 3);
    const rim = new THREE.PointLight(0xffffff, 20);
    rim.position.set(-2, 1, -2);
    scene.add(ambient, point, rim);

    const group = new THREE.Group();
    group.position.z = sorted.length * 0.55;
    scene.add(group);

    const disposables: { geometry: THREE.BufferGeometry; material: THREE.Material; texture?: THREE.Texture }[] = [];
    const REFERENCE_WINDOW_DAYS = 90;

    sorted.forEach((item, index) => {
      const z = -index * 1.35;
      const days = daysUntil(item.date);
      const dayLabel = days === 0 ? "Today" : days > 0 ? `${days}d away` : `${Math.abs(days)}d ago`;
      const sandColor = urgencyColor(days);
      // 0 = far away (sand all on top), 1 = deadline reached/passed (sand all
      // at the bottom) — same 90-day reference window as the exam countdown
      // ring, for a consistent meaning across both visualizations.
      const progress = Math.max(0, Math.min(1, 1 - days / REFERENCE_WINDOW_DAYS));

      const itemGroup = new THREE.Group();
      itemGroup.position.z = z;
      group.add(itemGroup);

      // frosted glass shell
      const glassGeometry = hourglassGeometry();
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf8ecd9,
        transparent: true,
        opacity: 0.22,
        roughness: 0.15,
        metalness: 0,
        side: THREE.DoubleSide,
      });
      const glass = new THREE.Mesh(glassGeometry, glassMaterial);
      itemGroup.add(glass);
      disposables.push({ geometry: glassGeometry, material: glassMaterial });

      // top bulb sand — shrinks as progress increases, anchored at the neck
      const topMaxHeight = 0.32;
      const topHeight = Math.max(0.001, (1 - progress) * topMaxHeight);
      const topSandGeometry = new THREE.CylinderGeometry(0.14, 0.2, topHeight, 16);
      const sandMaterial = new THREE.MeshStandardMaterial({
        color: sandColor,
        emissive: sandColor,
        emissiveIntensity: 0.35,
        roughness: 0.6,
      });
      const topSand = new THREE.Mesh(topSandGeometry, sandMaterial);
      topSand.position.y = 0.5 + topHeight / 2;
      itemGroup.add(topSand);
      disposables.push({ geometry: topSandGeometry, material: sandMaterial });

      // bottom bulb sand — grows as progress increases
      const bottomMaxHeight = 0.32;
      const bottomHeight = Math.max(0.001, progress * bottomMaxHeight);
      const bottomSandGeometry = new THREE.CylinderGeometry(0.2, 0.14, bottomHeight, 16);
      const bottomSandMaterial = sandMaterial.clone();
      const bottomSand = new THREE.Mesh(bottomSandGeometry, bottomSandMaterial);
      bottomSand.position.y = 0.05 + bottomHeight / 2;
      itemGroup.add(bottomSand);
      disposables.push({ geometry: bottomSandGeometry, material: bottomSandMaterial });

      // a thin falling-sand stream through the neck for anything not yet finished
      if (progress > 0.02 && progress < 0.98) {
        const streamGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6);
        const streamMaterial = sandMaterial.clone();
        const stream = new THREE.Mesh(streamGeometry, streamMaterial);
        stream.position.y = 0.46;
        itemGroup.add(stream);
        disposables.push({ geometry: streamGeometry, material: streamMaterial });
      }

      const texture = makeLabelTexture(item.label, dayLabel, `#${sandColor.toString(16).padStart(6, "0")}`);
      const labelGeometry = new THREE.PlaneGeometry(1.5, 1.5 * (160 / 512));
      const labelMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.set(0, -0.35, 0.02);
      itemGroup.add(label);
      disposables.push({ geometry: labelGeometry, material: labelMaterial, texture });
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2 - 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.35;
    controls.minAzimuthAngle = -0.7;
    controls.maxAzimuthAngle = 0.7;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0.3, sorted.length * 0.55);

    function resize() {
      if (!container) return;
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth || 1, clientHeight || 1, false);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let frameId = 0;
    function animate() {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      disposables.forEach(({ geometry, material, texture }) => {
        geometry.dispose();
        material.dispose();
        texture?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [sorted]);

  if (sorted.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-panel-muted">
        Add an exam deadline to see your 3D timeline.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-56 w-full cursor-grab overflow-hidden rounded-lg border border-panel-border/30 active:cursor-grabbing"
    />
  );
}
