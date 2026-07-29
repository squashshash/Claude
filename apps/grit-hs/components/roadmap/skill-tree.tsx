"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import {
  GRADE_LEVELS,
  MILESTONE_CATEGORIES,
  MILESTONE_CATEGORY_LABELS,
  type MilestoneCategory,
  type MilestoneStatus,
} from "@/lib/constants";
import type { ResolvedMilestone } from "@/types/roadmap";

const WIDTH = 720;
const HEIGHT = 480;
const TRUNK_X = WIDTH / 2;
const TRUNK_Y = HEIGHT - 24;
const BRANCH_SPREAD_DEG = 130;
const NODE_GAP = 78;
const NODE_R = 16;

const BRANCH_ANGLES: Record<MilestoneCategory, number> = (() => {
  const n = MILESTONE_CATEGORIES.length;
  const start = -BRANCH_SPREAD_DEG / 2;
  const step = n > 1 ? BRANCH_SPREAD_DEG / (n - 1) : 0;
  const angles = {} as Record<MilestoneCategory, number>;
  MILESTONE_CATEGORIES.forEach((category, i) => {
    // 0deg = straight up; convert to radians measured from the -Y axis.
    angles[category] = ((start + step * i) * Math.PI) / 180;
  });
  return angles;
})();

function nodeStyle(status: MilestoneStatus) {
  switch (status) {
    case "completed":
      return { fill: "hsl(var(--primary))", stroke: "hsl(var(--primary))" };
    case "in_progress":
      return { fill: "hsl(var(--accent) / 0.35)", stroke: "hsl(var(--accent))" };
    case "locked":
      return { fill: "hsl(var(--locked))", stroke: "hsl(var(--locked))" };
    default:
      return { fill: "hsl(var(--card))", stroke: "hsl(var(--border))" };
  }
}

export function SkillTree({
  milestones,
  onToggleComplete,
}: {
  milestones: ResolvedMilestone[];
  onToggleComplete?: (id: string, nextStatus: MilestoneStatus) => Promise<void> | void;
}) {
  const gradientId = useId();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const branches = MILESTONE_CATEGORIES.map((category) => {
    const nodes = GRADE_LEVELS.map((grade) =>
      milestones.find((m) => m.milestone.category === category && m.milestone.gradeLevel === grade)
    ).filter((m): m is ResolvedMilestone => Boolean(m));

    const angle = BRANCH_ANGLES[category];
    const dx = Math.sin(angle);
    const dy = -Math.cos(angle);

    const points = nodes.map((_, i) => ({
      x: TRUNK_X + dx * NODE_GAP * (i + 1),
      y: TRUNK_Y + dy * NODE_GAP * (i + 1),
    }));

    return { category, nodes, points };
  });

  const handleClick = async (m: ResolvedMilestone) => {
    if (!m.id || !onToggleComplete || m.status === "locked" || pendingId) return;
    setPendingId(m.id);
    try {
      await onToggleComplete(m.id, m.status === "completed" ? "not_started" : "completed");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="mx-auto h-full w-full max-w-2xl overflow-visible"
      role="img"
      aria-label="Skill tree of roadmap milestones by category"
    >
      <defs>
        <radialGradient id={gradientId}>
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={TRUNK_X} cy={TRUNK_Y} r={22} fill={`url(#${gradientId})`} />
      <circle cx={TRUNK_X} cy={TRUNK_Y} r={10} fill="hsl(var(--primary))" />

      {branches.map(({ category, points }) => {
        const linePoints = [{ x: TRUNK_X, y: TRUNK_Y }, ...points];
        const pathD = linePoints
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
          .join(" ");
        return (
          <motion.path
            key={`line-${category}`}
            d={pathD}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}

      {branches.map(({ category, points }) => {
        const last = points[points.length - 1];
        if (!last) return null;
        return (
          <text
            key={`label-${category}`}
            x={last.x}
            y={last.y + (last.y < TRUNK_Y - HEIGHT * 0.35 ? -22 : 0) - 22}
            textAnchor="middle"
            className="fill-foreground text-[11px] font-semibold uppercase tracking-wide"
          >
            {MILESTONE_CATEGORY_LABELS[category]}
          </text>
        );
      })}

      {branches.map(({ category, nodes, points }) =>
        nodes.map((m, i) => {
          const { x, y } = points[i];
          const style = nodeStyle(m.status);
          const interactive = Boolean(m.id && onToggleComplete && m.status !== "locked");
          return (
            <motion.g
              key={m.id ?? `${category}-${m.milestone.gradeLevel}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: pendingId === m.id ? 0.6 : 1 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
              style={{ transformOrigin: `${x}px ${y}px`, cursor: interactive ? "pointer" : "default" }}
              onClick={() => handleClick(m)}
              tabIndex={interactive ? 0 : -1}
              role={interactive ? "button" : undefined}
              aria-label={`${m.milestone.title} — ${m.status.replace("_", " ")}`}
              onKeyDown={(e) => {
                if (interactive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleClick(m);
                }
              }}
            >
              <circle cx={x} cy={y} r={NODE_R} fill={style.fill} stroke={style.stroke} strokeWidth={2} />
              {m.status === "completed" && (
                <Check x={x - 8} y={y - 8} width={16} height={16} color="hsl(var(--primary-foreground))" />
              )}
              {m.status === "locked" && (
                <Lock x={x - 7} y={y - 7} width={14} height={14} color="hsl(var(--locked-foreground))" />
              )}
              <title>
                {m.milestone.title} ({m.status.replace("_", " ")}) — {m.milestone.description}
              </title>
            </motion.g>
          );
        })
      )}
    </svg>
  );
}
