import type {
  CareerTrack,
  GradeLevel,
  MilestoneCategory,
  MilestoneStatus,
} from "@/lib/constants";

export interface MilestoneTemplate {
  gradeLevel: GradeLevel;
  category: MilestoneCategory;
  title: string;
  description: string;
  agePrerequisite?: number;
  status?: MilestoneStatus;
  /** Exact `certifications.title` this milestone is age-gated against, if any. */
  certRef?: string;
}

export interface CareerTrackTemplate {
  track: CareerTrack;
  label: string;
  summary: string;
  milestones: MilestoneTemplate[];
}

/**
 * A milestone paired with its resolved status, used by every roadmap
 * component so they don't care whether the status was derived (mock mode)
 * or read straight from the DB (real mode). `id` is present only for real
 * milestones — its presence is what turns on the complete/incomplete toggle.
 */
export interface ResolvedMilestone {
  id?: string;
  milestone: MilestoneTemplate;
  status: MilestoneStatus;
}
