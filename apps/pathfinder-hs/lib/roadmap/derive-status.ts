import { GRADE_LEVELS, type GradeLevel, type MilestoneStatus } from "@/lib/constants";
import { isTooYoung } from "./age-rules";
import type { MilestoneTemplate } from "@/types/roadmap";

/**
 * Phase 2 demo logic: infers a milestone's status from grade-level ordering
 * and the age-gate rules, since there's no real per-student progress record
 * yet (that's Phase 3, backed by the `milestones.status` column).
 */
export function deriveMilestoneStatus(
  milestone: MilestoneTemplate,
  currentGrade: GradeLevel,
  studentAge: number,
  studentState?: string
): MilestoneStatus {
  if (milestone.certRef && isTooYoung(milestone.certRef, studentAge, studentState)) {
    return "locked";
  }

  const currentIdx = GRADE_LEVELS.indexOf(currentGrade);
  const milestoneIdx = GRADE_LEVELS.indexOf(milestone.gradeLevel);

  if (milestoneIdx < currentIdx) return "completed";
  if (milestoneIdx === currentIdx) return "in_progress";
  return "not_started";
}
