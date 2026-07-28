"use client";

import { useId } from "react";
import { motion } from "framer-motion";

export interface RadarAxis {
  label: string;
  pct: number;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 65;
const RINGS = 4;

function pointAt(angle: number, radius: number): [number, number] {
  return [CENTER + radius * Math.cos(angle), CENTER + radius * Math.sin(angle)];
}

export function SkillRadarChart({ axes }: { axes: RadarAxis[] }) {
  const gradientId = useId();
  const n = axes.length;
  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const dataPoints = axes.map((axis, i) => pointAt(angleFor(i), (RADIUS * axis.pct) / 100));
  const dataPath = dataPoints.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto h-full w-full max-w-sm overflow-visible"
      role="img"
      aria-label="Skill category progress radar chart"
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {Array.from({ length: RINGS }).map((_, ring) => {
        const r = (RADIUS * (ring + 1)) / RINGS;
        const ringPoints = axes.map((_, i) => pointAt(angleFor(i), r));
        return (
          <polygon
            key={ring}
            points={ringPoints.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        );
      })}

      {axes.map((_, i) => {
        const [x, y] = pointAt(angleFor(i), RADIUS);
        return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />;
      })}

      <motion.polygon
        points={dataPath}
        fill={`url(#${gradientId})`}
        stroke="hsl(var(--accent))"
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
      />

      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="hsl(var(--accent))" />
      ))}

      {axes.map((axis, i) => {
        const [lx, ly] = pointAt(angleFor(i), RADIUS + 20);
        return (
          <text
            key={axis.label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-[10px] font-semibold uppercase tracking-wide"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}
