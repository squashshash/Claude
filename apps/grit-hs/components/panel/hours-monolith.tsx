"use client";

import dynamic from "next/dynamic";

const HoursMonolithScene = dynamic(
  () => import("./hours-monolith-scene").then((mod) => mod.HoursMonolithScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center text-sm text-panel-muted">Loading…</div>
    ),
  }
);

interface HoursMonolithProps {
  totalHours: number;
}

export function HoursMonolith({ totalHours }: HoursMonolithProps) {
  return <HoursMonolithScene totalHours={totalHours} />;
}
