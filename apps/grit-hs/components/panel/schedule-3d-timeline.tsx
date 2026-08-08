"use client";

import dynamic from "next/dynamic";
import type { TimelineItem } from "./schedule-3d-scene";

export type { TimelineItem };

// Code-split — three.js/drei only load once an exam actually exists to
// visualize and this detail view is open, never as part of the main bundle.
const Schedule3DScene = dynamic(
  () => import("./schedule-3d-scene").then((mod) => mod.Schedule3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center text-sm text-panel-muted">Loading timeline…</div>
    ),
  }
);

interface Schedule3DTimelineProps {
  items: TimelineItem[];
}

export function Schedule3DTimeline({ items }: Schedule3DTimelineProps) {
  return <Schedule3DScene items={items} />;
}
