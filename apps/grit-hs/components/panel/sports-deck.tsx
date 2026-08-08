"use client";

import { useCallback, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";

export interface DeckSport {
  id: string;
  name: string;
  season: string | null;
  role: string | null;
  practice_schedule: string | null;
  coach_name: string | null;
}

interface SportsDeckProps {
  sports: DeckSport[];
  onRemove: (id: string) => void;
}

// Scroll-driven pseudo-3D card deck: each card's rotateX/translateZ/scale is
// a function of its distance from the container's vertical center, updated
// on every scroll event — a "coverflow" fan, pure CSS 3D transforms (no
// WebGL, so none of the react-three-fiber fragility this environment has).
export function SportsDeck({ sports, onRemove }: SportsDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    for (const sport of sports) {
      const card = cardRefs.current.get(sport.id);
      if (!card) continue;
      const cardRect = card.getBoundingClientRect();
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const delta = (cardCenterY - centerY) / (containerRect.height / 2);
      const clamped = Math.max(-1, Math.min(1, delta));
      const rotateX = clamped * -22;
      const translateZ = -Math.abs(clamped) * 60;
      const scale = 1 - Math.abs(clamped) * 0.12;
      const opacity = 1 - Math.abs(clamped) * 0.35;
      card.style.transform = `rotateX(${rotateX}deg) translateZ(${translateZ}px) scale(${scale})`;
      card.style.opacity = String(Math.max(0.4, opacity));
    }
  }, [sports]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Recompute directly on scroll rather than deferring through
    // requestAnimationFrame — rAF can be throttled/paused for tabs the
    // browser doesn't consider visible, which would otherwise make the
    // fan silently stop updating.
    updateTransforms();
    container.addEventListener("scroll", updateTransforms, { passive: true });
    window.addEventListener("resize", updateTransforms);
    return () => {
      container.removeEventListener("scroll", updateTransforms);
      window.removeEventListener("resize", updateTransforms);
    };
  }, [updateTransforms]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${mx}%`);
    e.currentTarget.style.setProperty("--my", `${my}%`);
  }

  return (
    <div
      ref={containerRef}
      className="h-72 overflow-y-auto rounded-lg border border-panel-border/30 bg-panel/30 px-6 py-24"
      style={{ perspective: "900px" }}
    >
      <div className="flex flex-col gap-8" style={{ transformStyle: "preserve-3d" }}>
        {sports.map((sport) => (
          <div
            key={sport.id}
            ref={(el) => {
              if (el) cardRefs.current.set(sport.id, el);
              else cardRefs.current.delete(sport.id);
            }}
            onPointerMove={handlePointerMove}
            className="group relative overflow-hidden rounded-xl border border-panel-border/50 bg-panel-card p-4 shadow-[inset_0_1px_0_0_rgba(248,236,217,0.15),0_12px_28px_-10px_rgba(0,0,0,0.6)] transition-transform duration-100 will-change-transform"
          >
            {/* holographic sheen — tracks pointer, revealed on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.35), rgba(74,163,255,0.25) 25%, rgba(255,92,122,0.25) 45%, rgba(74,222,154,0.25) 65%, transparent 75%)",
                mixBlendMode: "color-dodge",
              }}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className={cn(bangers.className, "text-xl text-panel-foreground")}>{sport.name}</p>
                <p className="font-interface text-sm text-panel-muted">
                  {[sport.season, sport.role].filter(Boolean).join(" · ")}
                </p>
                {sport.coach_name && (
                  <p className="font-interface text-xs text-panel-muted">Coach: {sport.coach_name}</p>
                )}
                {sport.practice_schedule && (
                  <p className="font-interface text-xs text-panel-muted">{sport.practice_schedule}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(sport.id)}
                className="shrink-0 rounded-full p-1.5 text-panel-muted opacity-0 transition-opacity hover:bg-panel/60 hover:text-destructive group-hover:opacity-100"
                aria-label={`Remove ${sport.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
