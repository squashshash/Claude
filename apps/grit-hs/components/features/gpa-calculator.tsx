"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClassRow {
  id: string;
  name: string;
  currentGrade: number;
  remainingWeight: number;
  targetGrade: number;
  honors: boolean;
}

function gradeToGpaPoints(grade: number, honors: boolean): number {
  let points: number;
  if (grade >= 93) points = 4.0;
  else if (grade >= 90) points = 3.7;
  else if (grade >= 87) points = 3.3;
  else if (grade >= 83) points = 3.0;
  else if (grade >= 80) points = 2.7;
  else if (grade >= 77) points = 2.3;
  else if (grade >= 73) points = 2.0;
  else if (grade >= 70) points = 1.7;
  else points = 1.0;
  return honors ? Math.min(5.0, points + 1.0) : points;
}

function requiredRemainingScore(row: ClassRow): number {
  const w = row.remainingWeight / 100;
  if (w <= 0) return row.currentGrade;
  return (row.targetGrade - row.currentGrade * (1 - w)) / w;
}

const DEFAULT_ROWS: ClassRow[] = [
  { id: "1", name: "AP Chemistry", currentGrade: 88, remainingWeight: 30, targetGrade: 93, honors: true },
  { id: "2", name: "Anatomy & Physiology", currentGrade: 91, remainingWeight: 20, targetGrade: 95, honors: false },
  { id: "3", name: "DE General Psychology", currentGrade: 84, remainingWeight: 40, targetGrade: 90, honors: false },
];

export function GpaCalculator() {
  const [rows, setRows] = useState<ClassRow[]>(DEFAULT_ROWS);
  const idBase = useId();

  const updateRow = (id: string, patch: Partial<ClassRow>) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((r) => [
      ...r,
      {
        id: `${idBase}-${r.length}-${Date.now()}`,
        name: "New class",
        currentGrade: 85,
        remainingWeight: 30,
        targetGrade: 90,
        honors: false,
      },
    ]);

  const removeRow = (id: string) => setRows((r) => r.filter((row) => row.id !== id));

  const projectedGpa =
    rows.length === 0
      ? 0
      : rows.reduce((sum, row) => sum + gradeToGpaPoints(row.targetGrade, row.honors), 0) / rows.length;

  const onTrackCount = rows.filter((row) => {
    const req = requiredRemainingScore(row);
    return req <= 100;
  }).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Projected weighted GPA</CardDescription>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={projectedGpa.toFixed(2)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <CardTitle className="text-3xl">{projectedGpa.toFixed(2)}</CardTitle>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Classes on track</CardDescription>
            <CardTitle className="text-3xl">
              {onTrackCount} / {rows.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <AnimatePresence initial={false}>
            {rows.map((row) => {
              const required = requiredRemainingScore(row);
              const impossible = required > 100;
              const locked = row.remainingWeight <= 0;
              const bigPush = !impossible && !locked && required > row.currentGrade + 12;

              return (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg border border-border bg-background/40 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <input
                      value={row.name}
                      onChange={(e) => updateRow(row.id, { name: e.target.value })}
                      className="min-w-[10rem] flex-1 bg-transparent font-display text-lg font-bold outline-none"
                      aria-label="Class name"
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={row.honors}
                          onChange={(e) => updateRow(row.id, { honors: e.target.checked })}
                        />
                        AP/Honors (+1.0)
                      </label>
                      <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)} aria-label="Remove class">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
                      Current grade ({row.currentGrade}%)
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={row.currentGrade}
                        onChange={(e) => updateRow(row.id, { currentGrade: Number(e.target.value) })}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
                      Remaining weight ({row.remainingWeight}%)
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={row.remainingWeight}
                        onChange={(e) => updateRow(row.id, { remainingWeight: Number(e.target.value) })}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-muted-foreground">
                      Target final grade ({row.targetGrade}%)
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={row.targetGrade}
                        onChange={(e) => updateRow(row.id, { targetGrade: Number(e.target.value) })}
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {locked ? (
                      <Badge variant="outline">Nothing left to grade — locked in at {row.currentGrade}%</Badge>
                    ) : impossible ? (
                      <Badge variant="destructive">
                        Not mathematically possible — needs {required.toFixed(0)}% on what&apos;s left
                      </Badge>
                    ) : bigPush ? (
                      <Badge variant="locked">Needs {required.toFixed(0)}% on what&apos;s left — big push</Badge>
                    ) : (
                      <Badge variant="default">On track — just {required.toFixed(0)}% needed from here</Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Button variant="outline" onClick={addRow} className="w-fit gap-2">
            <Plus className="h-4 w-4" /> Add a class
          </Button>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        Drag the sliders — everything recalculates instantly, no submit button.
      </p>
    </div>
  );
}
