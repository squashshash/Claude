"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";

export interface MatrixClass {
  id: string;
  course_name: string;
  days_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  teacher_name: string | null;
}

const DAY_TOKENS: { token: string; index: number }[] = [
  { token: "sun", index: 0 },
  { token: "mon", index: 1 },
  { token: "tue", index: 2 },
  { token: "wed", index: 3 },
  { token: "thu", index: 4 },
  { token: "fri", index: 5 },
  { token: "sat", index: 6 },
  { token: "th", index: 4 },
  { token: "tu", index: 2 },
  { token: "su", index: 0 },
  { token: "sa", index: 6 },
  { token: "m", index: 1 },
  { token: "t", index: 2 },
  { token: "w", index: 3 },
  { token: "f", index: 5 },
  { token: "s", index: 6 },
].sort((a, b) => b.token.length - a.token.length);

// Greedy longest-match tokenizer over the free-text days field ("MWF",
// "TTh", "Mon/Wed/Fri", …) — real parsing of what the student actually
// typed, not a fabricated day assignment.
function parseDays(daysOfWeek: string | null): Set<number> {
  if (!daysOfWeek) return new Set([0, 1, 2, 3, 4, 5, 6]); // no restriction entered = treat as every day
  const cleaned = daysOfWeek.toLowerCase().replace(/[^a-z]/g, "");
  const result = new Set<number>();
  let i = 0;
  while (i < cleaned.length) {
    const match = DAY_TOKENS.find((d) => cleaned.startsWith(d.token, i));
    if (match) {
      result.add(match.index);
      i += match.token.length;
    } else {
      i += 1;
    }
  }
  return result.size > 0 ? result : new Set([0, 1, 2, 3, 4, 5, 6]);
}

function parseTimeToMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function formatTime(t: string | null): string {
  const mins = parseTimeToMinutes(t);
  if (mins === null) return "";
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

interface ClassTimeMatrixProps {
  classes: MatrixClass[];
  onRemove: (id: string) => void;
}

export function ClassTimeMatrix({ classes, onRemove }: ClassTimeMatrixProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(
    () =>
      classes
        .slice()
        .sort((a, b) => (parseTimeToMinutes(a.start_time) ?? 9999) - (parseTimeToMinutes(b.start_time) ?? 9999)),
    [classes]
  );

  const nowMinutes = now ? now.getHours() * 60 + now.getMinutes() : null;
  const todayIndex = now ? now.getDay() : null;

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((cls) => {
        const startMin = parseTimeToMinutes(cls.start_time);
        const endMin = parseTimeToMinutes(cls.end_time);
        const activeToday = todayIndex !== null && parseDays(cls.days_of_week).has(todayIndex);
        const isCurrent =
          activeToday && nowMinutes !== null && startMin !== null && endMin !== null && nowMinutes >= startMin && nowMinutes < endMin;
        const isPast = activeToday && nowMinutes !== null && endMin !== null && nowMinutes >= endMin;
        const expanded = expandedId === cls.id;

        return (
          <motion.div
            key={cls.id}
            layout
            onClick={() => setExpandedId(expanded ? null : cls.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-lg border p-3 backdrop-blur-xl transition-colors",
              isCurrent
                ? "border-panel-accent bg-panel-accent/15 shadow-[0_0_22px_-2px_rgba(74,222,154,0.5)]"
                : isPast
                  ? "border-panel-border/20 bg-panel/20 opacity-45"
                  : "border-panel-border/30 bg-panel/40"
            )}
          >
            {isCurrent && (
              <motion.div
                className="absolute inset-y-0 left-0 w-1 bg-panel-accent"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className={cn(bangers.className, "truncate text-lg text-panel-foreground")}>{cls.course_name}</p>
                <p className="font-interface text-xs text-panel-muted">
                  {startMin !== null && endMin !== null ? `${formatTime(cls.start_time)} – ${formatTime(cls.end_time)}` : "No time set"}
                  {cls.days_of_week ? ` · ${cls.days_of_week}` : ""}
                </p>
              </div>
              {isCurrent && (
                <span className="shrink-0 rounded-full bg-panel-accent/25 px-2 py-0.5 font-interface text-[10px] font-bold uppercase tracking-wide text-panel-accent">
                  Now
                </span>
              )}
            </div>

            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-panel-border/20 pt-2">
                    <div className="font-interface text-sm text-panel-muted">
                      {cls.room && <p>Room {cls.room}</p>}
                      {cls.teacher_name && <p>{cls.teacher_name}</p>}
                      {!cls.room && !cls.teacher_name && <p>No room/teacher on file</p>}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(cls.id);
                      }}
                      className="shrink-0 rounded-full p-1.5 text-panel-muted hover:bg-panel-card hover:text-destructive"
                      aria-label={`Remove ${cls.course_name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
