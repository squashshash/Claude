import { GraduationCap, ShieldCheck, Trophy, Briefcase, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  milestone,
  status,
  studentAge,
  studentState,
}: {
  milestone: MilestoneTemplate;
  status: MilestoneStatus;
  studentAge: number;
  studentState?: string;
}) {
  const Icon = CATEGORY_ICON[milestone.category];

  return (
    <Card
      className={cn(
        "border-l-4",
        status === "locked" ? "border-l-locked" : "border-l-primary"
      )}
    >
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
        </div>
        <p className="font-display text-sm font-semibold leading-snug">{milestone.title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{milestone.description}</p>
        {milestone.certRef && (
          <div className="pt-1">
            <AgeGateBadge certRef={milestone.certRef} studentAge={studentAge} studentState={studentState} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
