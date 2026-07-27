"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { deriveMilestoneStatus } from "@/lib/roadmap/derive-status";
import { MILESTONE_CATEGORY_LABELS, type MilestoneCategory } from "@/lib/constants";
import type { MilestoneTemplate } from "@/types/roadmap";

const TASK_TEMPLATES: Record<MilestoneCategory, (title: string) => string[]> = {
  academics: (t) => [
    `Review your notes on "${t}" for 15 minutes`,
    `Do 10 practice problems related to "${t}"`,
    `Ask a teacher one question about "${t}"`,
  ],
  certifications: (t) => [
    `Look up the very next step toward "${t}"`,
    `Spend 15 minutes with prep materials for "${t}"`,
    `Double-check the age/eligibility rules for "${t}"`,
  ],
  ctso: (t) => [
    `Run one practice round for "${t}"`,
    `Watch a past "${t}" competition online`,
    `Draft your opening line for "${t}"`,
  ],
  experience: (t) => [
    `Send one message to move "${t}" forward`,
    `Log any hours you already have toward "${t}"`,
    `Write 3 sentences on why "${t}" matters to you`,
  ],
};

interface Task {
  id: string;
  category: MilestoneCategory;
  milestoneTitle: string;
  text: string;
}

function buildTasks(milestones: MilestoneTemplate[]): Task[] {
  return milestones.flatMap((m) =>
    TASK_TEMPLATES[m.category](m.title).map((text, i) => ({
      id: `${m.category}-${i}`,
      category: m.category,
      milestoneTitle: m.title,
      text,
    }))
  );
}

export function WeeklyTasks() {
  const template = getRoadmapTemplate(MOCK_STUDENT.targetCareer);
  const inProgress = template.milestones.filter(
    (m) =>
      deriveMilestoneStatus(m, MOCK_STUDENT.currentGrade, MOCK_STUDENT.age, MOCK_STUDENT.state) === "in_progress"
  );
  const tasks = useMemo(() => buildTasks(inProgress), [inProgress]);
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pct = tasks.length ? Math.round((done.size / tasks.length) * 100) : 0;
  const allDone = tasks.length > 0 && done.size === tasks.length;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">This week&apos;s progress</span>
            <span className="font-display text-2xl font-bold">{pct}%</span>
          </div>
          <Progress value={pct} className="h-3" />
        </CardContent>
      </Card>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="border-accent bg-accent/10">
              <CardContent className="flex items-center gap-3 p-5">
                <PartyPopper className="h-6 w-6 text-accent" aria-hidden="true" />
                <p className="font-display text-lg font-bold">
                  Every task this week, done. That&apos;s the whole game.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const checked = done.has(task.id);
          return (
            <motion.button
              key={task.id}
              layout
              onClick={() => toggle(task.id)}
              className="text-left"
              whileTap={{ scale: 0.98 }}
            >
              <Card className={checked ? "opacity-60" : undefined}>
                <CardContent className="flex items-center gap-3 p-4">
                  <span
                    className={
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors " +
                      (checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground")
                    }
                  >
                    {checked && <Check className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className={"text-sm font-medium " + (checked ? "line-through" : "")}>{task.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {MILESTONE_CATEGORY_LABELS[task.category]} &middot; {task.milestoneTitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          );
        })}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No in-progress milestones this grade yet — check the 4-Year Roadmap.
          </p>
        )}
      </div>
    </div>
  );
}
