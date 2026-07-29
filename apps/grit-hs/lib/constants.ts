export const CAREER_TRACKS = [
  "pre_med_clinical_healthcare",
  "nursing_advanced_practice",
  "software_engineering",
  "financial_engineering",
  "mechanical_engineering_cad",
  "law_public_policy",
] as const;

export type CareerTrack = (typeof CAREER_TRACKS)[number];

export const CAREER_TRACK_LABELS: Record<CareerTrack, string> = {
  pre_med_clinical_healthcare: "Pre-Medicine & Clinical Healthcare",
  nursing_advanced_practice: "Nursing & Advanced Practice",
  software_engineering: "Software Engineering & Computational Systems",
  financial_engineering: "Financial Engineering & Quantitative Finance",
  mechanical_engineering_cad: "Mechanical Engineering, CAD & Industrial Design",
  law_public_policy: "Jurisprudence, Constitutional Law & Public Policy",
};

export const GRADE_LEVELS = [
  "summer_0",
  "grade_9",
  "grade_10",
  "grade_11",
  "grade_12",
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];

export const GRADE_LEVEL_LABELS: Record<GradeLevel, string> = {
  summer_0: "Summer -0",
  grade_9: "Grade 9",
  grade_10: "Grade 10",
  grade_11: "Grade 11",
  grade_12: "Grade 12",
};

export const MILESTONE_CATEGORIES = [
  "academics",
  "certifications",
  "ctso",
  "experience",
] as const;

export type MilestoneCategory = (typeof MILESTONE_CATEGORIES)[number];

export const MILESTONE_CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  academics: "Academics & Dual Enrollment",
  certifications: "Certifications & Legal Prerequisites",
  ctso: "Extracurriculars & CTSOs",
  experience: "Real-World Experience",
};

export const MILESTONE_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "locked",
] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

/** XP awarded when a milestone is marked completed, and revoked if un-marked. */
export const MILESTONE_XP_AWARD = 100;
