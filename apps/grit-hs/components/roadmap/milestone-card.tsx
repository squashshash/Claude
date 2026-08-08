"use client";

import { useState } from "react";
import { GraduationCap, ShieldCheck, Trophy, Briefcase, Check, Undo2, Loader2, CalendarClock, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgeGateBadge } from "@/components/certifications/age-gate-badge";
import { cn } from "@/lib/utils";
import type { MilestoneCategory, MilestoneStatus } from "@/lib/constants";
import type { MilestoneTemplate } from "@/types/roadmap";

const CATEGORY_ICON: Record<MilestoneCategory, LucideIcon> = {
  academics: GraduationCap,
  certifications: ShieldCheck,
  ctso: Trophy,
  experience: Briefcase,
};

const STATUS_LABEL: Record<MilestoneStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  locked: "Locked",
};

const STATUS_BADGE_VARIANT: Record<MilestoneStatus, "default" | "accent" | "outline" | "locked"> = {
  not_started: "outline",
  in_progress: "accent",
  completed: "default",
  locked: "locked",
};

export function MilestoneCard({
  id,
  milestone,
  status,
  studentAge,
  studentState,
  plannedFor,
  onToggleComplete,
  onSetPlannedFor,
}: {
  id?: string;
  milestone: MilestoneTemplate;
  status: MilestoneStatus;
  studentAge: number;
  studentState?: string;
  plannedFor?: string | null;
  onToggleComplete?: (id: string, nextStatus: MilestoneStatus) => Promise<void> | void;
  onSetPlannedFor?: (id: string, date: string) => Promise<void> | void;
}) {
  const Icon = CATEGORY_ICON[milestone.category];
  const [pending, setPending] = useState(false);
  const [savingDate, setSavingDate] = useState(false);
  const canToggle = Boolean(id && onToggleComplete) && status !== "locked";
  const canPlan = Boolean(id && onSetPlannedFor) && status !== "completed" && status !== "locked";

  const handleToggle = async () => {
    if (!id || !onToggleComplete || pending) return;
    setPending(true);
    try {
      await onToggleComplete(id, status === "completed" ? "not_started" : "completed");
    } finally {
      setPending(false);
    }
  };

  const handlePlanDate = async (date: string) => {
    if (!id || !onSetPlannedFor || !date) return;
    setSavingDate(true);
    try {
      await onSetPlannedFor(id, date);
    } finally {
      setSavingDate(false);
    }
  };

  return (
    <Card
      className={cn(
        "border-l-4",
        status === "locked" ? "border-l-locked" : "border-l-primary"
      )}
    >
      <CardContent className="flex flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
        </div>
        <p className="font-display text-base font-bold leading-snug">{milestone.title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
        {milestone.certRef && (
          <div className="pt-1">
            <AgeGateBadge certRef={milestone.certRef} studentAge={studentAge} studentState={studentState} />
          </div>
        )}
        {canPlan && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {plannedFor ? (
              <span>
                Planned for {new Date(plannedFor + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            ) : (
              <span>When will you do this?</span>
            )}
            <Input
              type="date"
              defaultValue={plannedFor ?? undefined}
              disabled={savingDate}
              onChange={(e) => handlePlanDate(e.target.value)}
              className="h-7 w-auto py-0 text-xs"
              aria-label="When will you do this milestone?"
            />
          </div>
        )}
        {canToggle && (
          <Button
            type="button"
            size="sm"
            variant={status === "completed" ? "outline" : "default"}
            className="mt-1 gap-1.5 self-start"
            disabled={pending}
            onClick={handleToggle}
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : status === "completed" ? (
              <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {status === "completed" ? "Mark incomplete" : "Mark complete"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
