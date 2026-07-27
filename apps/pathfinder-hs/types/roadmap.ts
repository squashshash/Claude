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
