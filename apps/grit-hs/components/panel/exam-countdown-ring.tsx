"use client";

import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";

const REFERENCE_WINDOW_DAYS = 90;
const SIZE = 96;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function ringColor(daysLeft: number): string {
  if (daysLeft < 0) return "#8a8578";
  if (daysLeft <= 7) return "#ff5c5c";
  if (daysLeft <= 30) return "#ffcf4a";
  return "#4a8fff";
}

interface ExamCountdownRingProps {
  title: string;
  date: string;
  onClick: () => void;
}

// Radial SVG progress ring — fills as the exam approaches a 90-day
// reference window, calm blue -> amber -> crimson under 7 days, with a
// pulsing glow and a thin duplicated cyan/magenta outline (a CSS
// approximation of chromatic aberration) once it's genuinely urgent.
export function ExamCountdownRing({ title, date, onClick }: ExamCountdownRingProps) {
  const daysLeft = daysUntil(date);
  const color = ringColor(daysLeft);
  const urgent = daysLeft >= 0 && daysLeft <= 7;
  const progress = Math.max(0, Math.min(1, 1 - daysLeft / REFERENCE_WINDOW_DAYS));
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-transform hover:scale-105"
    >
      <div className="relative" style={{ width: SIZE, height: SIZE, color }}>
        {urgent && (
          <svg width={SIZE} height={SIZE} className="absolute inset-0 opacity-60" style={{ transform: "translate(-1.5px, 0)" }}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#5be9ff"
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </svg>
        )}
        {urgent && (
          <svg width={SIZE} height={SIZE} className="absolute inset-0 opacity-60" style={{ transform: "translate(1.5px, 0)" }}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#ff5cd6"
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          </svg>
        )}
        <svg
          width={SIZE}
          height={SIZE}
          className="relative"
          style={urgent ? { animation: "ring-pulse 1.4s ease-in-out infinite" } : undefined}
        >
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={STROKE} />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(bangers.className, "text-xl leading-none text-panel-foreground")}>
            {daysLeft < 0 ? "—" : daysLeft}
          </span>
          <span className="font-interface text-[10px] uppercase tracking-wide text-panel-muted">
            {daysLeft < 0 ? "past" : daysLeft === 0 ? "today" : "days"}
          </span>
        </div>
      </div>
      <p className="font-interface w-24 truncate text-xs font-semibold text-panel-foreground">{title}</p>
    </button>
  );
}
