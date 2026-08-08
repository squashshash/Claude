"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Code-split out of the main bundle — this only ever loads once the
// dashboard shell (right rail) mounts, never during initial page load/SSR.
const WebglLiquidScene = dynamic(
  () => import("./webgl-liquid-scene").then((mod) => mod.WebglLiquidScene),
  { ssr: false }
);

interface WebglBackgroundProps {
  className?: string;
  effects?: boolean;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// Ambient liquid-chromatic shader used behind both the collapsed rail and
// the expanded drawer. Falls back to the app's existing CSS float-slow glow
// (see components/layout/ambient-glow.tsx) when the OS requests reduced
// motion, since the shader's animation can't honor that media query itself.
export function WebglBackground({ className, effects = true }: WebglBackgroundProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden="true">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-panel-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-panel-highlight/20 blur-3xl" />
      </div>
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden="true">
      <WebglLiquidScene effects={effects} />
    </div>
  );
}
