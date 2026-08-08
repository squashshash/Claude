"use client";

import { useEffect, useRef } from "react";

export type ClubCategory = "stem" | "arts" | "athletics" | "service" | "other";

export interface ConstellationClub {
  id: string;
  name: string;
  category: ClubCategory;
  role: string | null;
  meeting_schedule: string | null;
}

const CATEGORY_META: Record<ClubCategory, { label: string; color: string }> = {
  stem: { label: "STEM Line", color: "#4aa3ff" },
  arts: { label: "Arts Line", color: "#ff5c7a" },
  athletics: { label: "Athletics Line", color: "#4ade9a" },
  service: { label: "Service Line", color: "#ffcf4a" },
  other: { label: "Other Line", color: "#c9b8a3" },
};

// Deterministic pseudo-random from a string id, so each node's idle orbit
// angle/radius/phase is stable across re-renders instead of jittering.
function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

interface Node {
  id: string;
  name: string;
  role: string | null;
  meetingSchedule: string | null;
  color: string;
  anchorX: number;
  anchorY: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
  x: number;
  y: number;
  swayX: number;
  swayY: number;
  isAnchor: boolean;
  category: ClubCategory;
}

interface ClubsConstellationProps {
  clubs: ConstellationClub[];
  onSelect: (club: ConstellationClub) => void;
}

export function ClubsConstellation({ clubs, onSelect }: ClubsConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clubsRef = useRef(clubs);
  clubsRef.current = clubs;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctx2d;

    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    let nodes: Node[] = [];
    let anchors: Node[] = [];
    let hoveredId: string | null = null;

    function buildLayout() {
      const categories = Array.from(new Set(clubsRef.current.map((c) => c.category)));
      const centerX = width / 2;
      const anchorSpacing = height / (categories.length + 1);

      anchors = categories.map((category, i) => ({
        id: `anchor-${category}`,
        name: CATEGORY_META[category].label,
        role: null,
        meetingSchedule: null,
        color: CATEGORY_META[category].color,
        anchorX: centerX,
        anchorY: anchorSpacing * (i + 1),
        orbitRadius: 0,
        orbitAngle: 0,
        orbitSpeed: 0,
        x: centerX,
        y: anchorSpacing * (i + 1),
        swayX: 0,
        swayY: 0,
        isAnchor: true,
        category,
      }));

      nodes = clubsRef.current.map((club) => {
        const anchor = anchors.find((a) => a.category === club.category)!;
        const seed = hashSeed(club.id);
        const angle = (seed % 360) * (Math.PI / 180);
        const radius = 34 + (seed % 40);
        return {
          id: club.id,
          name: club.name,
          role: club.role,
          meetingSchedule: club.meeting_schedule,
          color: anchor.color,
          anchorX: anchor.anchorX,
          anchorY: anchor.anchorY,
          orbitRadius: radius,
          orbitAngle: angle,
          orbitSpeed: 0.15 + (seed % 10) / 200,
          x: anchor.anchorX + Math.cos(angle) * radius,
          y: anchor.anchorY + Math.sin(angle) * radius,
          swayX: 0,
          swayY: 0,
          isAnchor: false,
          category: club.category,
        };
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 1;
      height = rect.height || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLayout();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    function handlePointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }
    function handlePointerLeave() {
      pointer.active = false;
    }
    function handleClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      for (const node of nodes) {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        if (Math.sqrt(dx * dx + dy * dy) < 16) {
          const club = clubsRef.current.find((c) => c.id === node.id);
          if (club) onSelectRef.current(club);
          return;
        }
      }
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("click", handleClick);

    let frameId = 0;
    let t = 0;

    function draw() {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      // idle orbit + gentle sine bob, then a soft repulsion sway near the
      // cursor (spring back toward the idle orbit position every frame)
      for (const node of nodes) {
        node.orbitAngle += node.orbitSpeed * 0.016;
        const idleX = node.anchorX + Math.cos(node.orbitAngle) * node.orbitRadius;
        const idleY = node.anchorY + Math.sin(node.orbitAngle) * node.orbitRadius + Math.sin(t + node.orbitRadius) * 3;

        let targetSwayX = 0;
        let targetSwayY = 0;
        if (pointer.active) {
          const dx = idleX - pointer.x;
          const dy = idleY - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = 90;
          if (dist < influence) {
            const force = (1 - dist / influence) * 22;
            targetSwayX = (dx / (dist || 1)) * force;
            targetSwayY = (dy / (dist || 1)) * force;
          }
        }
        node.swayX += (targetSwayX - node.swayX) * 0.08;
        node.swayY += (targetSwayY - node.swayY) * 0.08;
        node.x = idleX + node.swayX;
        node.y = idleY + node.swayY;
      }

      hoveredId = null;
      for (const node of nodes) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        if (pointer.active && Math.sqrt(dx * dx + dy * dy) < 16) hoveredId = node.id;
      }

      // transit lines: anchor to each of its club stations
      for (const node of nodes) {
        ctx.beginPath();
        ctx.moveTo(node.anchorX, node.anchorY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = node.color + "55";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // anchors — same soft-embossed treatment, larger
      for (const anchor of anchors) {
        ctx.beginPath();
        ctx.arc(anchor.x + 2, anchor.y + 2, 9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(anchor.x - 1.5, anchor.y - 1.5, 9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248,236,217,0.25)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 9, 0, Math.PI * 2);
        const anchorGrad = ctx.createRadialGradient(anchor.x - 3, anchor.y - 3, 1, anchor.x, anchor.y, 9);
        anchorGrad.addColorStop(0, anchor.color);
        anchorGrad.addColorStop(1, anchor.color + "cc");
        ctx.fillStyle = anchorGrad;
        ctx.shadowColor = anchor.color;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#f8ecd9";
        ctx.stroke();

        ctx.font = "700 11px Inter, sans-serif";
        ctx.fillStyle = "#f8ecd9";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(anchor.name, anchor.x + 16, anchor.y);
      }

      // club stations — soft embossed "neumorphic" pucks: a dark shadow
      // offset down-right, a light highlight offset up-left, then the flat
      // colored fill on top, so each station reads as a raised disc rather
      // than a flat glowing dot.
      for (const node of nodes) {
        const isHovered = node.id === hoveredId;
        const r = isHovered ? 13 : 10;

        ctx.beginPath();
        ctx.arc(node.x + 2, node.y + 2, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x - 1.5, node.y - 1.5, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(248,236,217,0.25)";
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(node.x - r * 0.35, node.y - r * 0.35, r * 0.1, node.x, node.y, r);
        grad.addColorStop(0, node.color);
        grad.addColorStop(1, node.color + "cc");
        ctx.fillStyle = grad;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isHovered ? 20 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isHovered ? "#f8ecd9" : "#f8ecd977";
        ctx.stroke();

        // always-visible label — every station shows which club it is,
        // not just on hover
        ctx.font = isHovered ? "700 12px Inter, sans-serif" : "600 10px Inter, sans-serif";
        ctx.fillStyle = isHovered ? "#f8ecd9" : "#f8ecd9cc";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const label = node.name.length > 20 ? `${node.name.slice(0, 18)}…` : node.name;
        ctx.fillText(label, node.x + r + 5, node.y);
      }

      canvas.style.cursor = hoveredId ? "pointer" : "default";
      frameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [clubs]);

  return (
    <canvas
      ref={canvasRef}
      className="h-64 w-full touch-none rounded-lg border border-panel-border/30 bg-panel/40"
    />
  );
}
