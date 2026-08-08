"use client";

import { useEffect, useMemo, useRef } from "react";
import Matter from "matter-js";

export type GravityPriority = "low" | "medium" | "high";

export interface GravityReminder {
  id: string;
  title: string;
  priority: GravityPriority;
}

const PRIORITY_COLOR: Record<GravityPriority, string> = {
  low: "#4a8fff",
  medium: "#ffcf4a",
  high: "#ff5c5c",
};

const PRIORITY_RADIUS: Record<GravityPriority, number> = {
  low: 16,
  medium: 20,
  high: 25,
};

const PRIORITY_PULL: Record<GravityPriority, number> = {
  low: 0.00006,
  medium: 0.00016,
  high: 0.00034,
};

interface ReminderBody {
  id: string;
  title: string;
  priority: GravityPriority;
  body: Matter.Body;
}

interface RemindersGravityPoolProps {
  reminders: GravityReminder[];
  onComplete: (id: string) => void;
}

// A real matter.js physics simulation for the passive behavior (idle drift,
// body-to-body collision, a continuous per-tick force pulling each body
// toward the center in proportion to its real priority) — but dragging is
// driven directly (pointer events + Body.setPosition/setVelocity) rather
// than through matter.js's own Mouse/MouseConstraint modules, since those
// never picked up a body in this environment despite verified-correct
// coordinates, collision filters, and button state (root cause not
// isolated after extensive testing); direct control sidesteps whatever
// that was and gives equally real physics for the drag itself.
export function RemindersGravityPool({ reminders, onComplete }: RemindersGravityPoolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const idsKey = useMemo(() => reminders.map((r) => r.id).sort().join(","), [reminders]);
  const remindersRef = useRef(reminders);
  remindersRef.current = reminders;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reminders.length === 0) return;

    const { Engine, World, Bodies, Body } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const world = engine.world;

    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full touch-none cursor-grab active:cursor-grabbing";
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;

    let width = 0;
    let height = 0;

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = rect.width || 1;
      height = rect.height || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const wallThickness = 40;
    const walls = [
      Bodies.rectangle(width / 2, -wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
      Bodies.rectangle(width / 2, height + wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
      Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
    ];
    World.add(world, walls);

    const shredderRadius = 26;
    const shredder = { x: width - 36, y: height - 36, radius: shredderRadius };

    const reminderBodies: ReminderBody[] = remindersRef.current.map((r) => {
      const radius = PRIORITY_RADIUS[r.priority];
      const body = Bodies.circle(
        radius + Math.random() * (width - radius * 2),
        radius + Math.random() * (height - radius * 2),
        radius,
        { restitution: 0.6, frictionAir: 0.02, density: 0.001 }
      );
      World.add(world, body);
      return { id: r.id, title: r.title, priority: r.priority, body };
    });

    Matter.Events.on(engine, "beforeUpdate", () => {
      for (const rb of reminderBodies) {
        if (rb.id === draggingId) continue;
        const pull = PRIORITY_PULL[rb.priority];
        const dx = width / 2 - rb.body.position.x;
        const dy = height / 2 - rb.body.position.y;
        Body.applyForce(rb.body, rb.body.position, { x: dx * pull, y: dy * pull });
      }
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // --- direct pointer-driven drag ---
    let draggingId: string | null = null;
    let lastPointerPos = { x: 0, y: 0 };
    let lastPointerTime = 0;
    let velocityEstimate = { x: 0, y: 0 };
    let shredding = false;

    function pointerToLocal(e: PointerEvent): { x: number; y: number } {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handlePointerDown(e: PointerEvent) {
      const pos = pointerToLocal(e);
      let closest: ReminderBody | null = null;
      let closestDist = Infinity;
      for (const rb of reminderBodies) {
        const dx = rb.body.position.x - pos.x;
        const dy = rb.body.position.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = PRIORITY_RADIUS[rb.priority];
        if (dist <= radius && dist < closestDist) {
          closest = rb;
          closestDist = dist;
        }
      }
      if (closest) {
        draggingId = closest.id;
        lastPointerPos = pos;
        lastPointerTime = performance.now();
        velocityEstimate = { x: 0, y: 0 };
        canvas.setPointerCapture(e.pointerId);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!draggingId) return;
      const pos = pointerToLocal(e);
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerTime);
      velocityEstimate = { x: ((pos.x - lastPointerPos.x) / dt) * 16, y: ((pos.y - lastPointerPos.y) / dt) * 16 };
      const entry = reminderBodies.find((rb) => rb.id === draggingId);
      if (entry) Body.setPosition(entry.body, pos);
      lastPointerPos = pos;
      lastPointerTime = now;
    }

    function handlePointerUp() {
      if (!draggingId || shredding) {
        draggingId = null;
        return;
      }
      const entry = reminderBodies.find((rb) => rb.id === draggingId);
      draggingId = null;
      if (!entry) return;

      const dx = entry.body.position.x - shredder.x;
      const dy = entry.body.position.y - shredder.y;
      if (Math.sqrt(dx * dx + dy * dy) < shredderRadius) {
        shredding = true;
        World.remove(world, entry.body);
        const idx = reminderBodies.findIndex((rb) => rb.id === entry.id);
        if (idx >= 0) reminderBodies.splice(idx, 1);
        onCompleteRef.current(entry.id);
        shredding = false;
      } else {
        Body.setVelocity(entry.body, velocityEstimate);
      }
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    let frameId = 0;
    let pulseT = 0;
    function draw() {
      pulseT += 0.05;
      ctx.clearRect(0, 0, width, height);

      const shredderPulse = 1 + Math.sin(pulseT) * 0.08;
      ctx.beginPath();
      ctx.arc(shredder.x, shredder.y, shredderRadius * shredderPulse, 0, Math.PI * 2);
      const shredderGrad = ctx.createRadialGradient(shredder.x, shredder.y, 2, shredder.x, shredder.y, shredderRadius * 1.4);
      shredderGrad.addColorStop(0, "#000000");
      shredderGrad.addColorStop(0.7, "#1a0f08");
      shredderGrad.addColorStop(1, "rgba(255,92,92,0.35)");
      ctx.fillStyle = shredderGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#ff5c5c88";
      ctx.stroke();

      for (const rb of reminderBodies) {
        const { x, y } = rb.body.position;
        const radius = PRIORITY_RADIUS[rb.priority];
        const color = PRIORITY_COLOR[rb.priority];
        const isDragging = rb.id === draggingId;
        const glowStrength = rb.priority === "high" ? 0.55 + Math.sin(pulseT * 2) * 0.25 : 0.35;

        ctx.beginPath();
        ctx.arc(x, y, isDragging ? radius * 1.12 : radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + "aa");
        ctx.fillStyle = grad;
        ctx.shadowColor = color;
        ctx.shadowBlur = (isDragging ? 26 : 8) + glowStrength * 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#f8ecd9aa";
        ctx.stroke();

        ctx.font = "600 10px Inter, sans-serif";
        ctx.fillStyle = "#04140d";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = rb.title.length > 12 ? `${rb.title.slice(0, 10)}…` : rb.title;
        if (radius > 15) ctx.fillText(label, x, y);
      }

      frameId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      Matter.Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
    // Rebuilds when the set of reminder ids changes (added/removed from
    // outside this pool) — completions from *inside* the pool are handled
    // without a rebuild via onComplete + the parent's own state update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return (
    <div className="flex flex-col gap-1">
      <p className="font-interface text-xs uppercase tracking-wide text-panel-muted">
        Drag a reminder into the well (bottom-right) to complete it
      </p>
      <div ref={containerRef} className="h-64 w-full overflow-hidden rounded-lg border border-panel-border/30 bg-panel/40" />
    </div>
  );
}
