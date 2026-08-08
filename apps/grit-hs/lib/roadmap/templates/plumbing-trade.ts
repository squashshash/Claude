import type { CareerTrackTemplate } from "@/types/roadmap";

export const plumbingTrade: CareerTrackTemplate = {
  track: "plumbing_trade",
  label: "Plumbing Trade",
  summary:
    "Plumbers/pipefitters install plumbing systems — a 4-5 year apprenticeship. This track uses the real named SkillsUSA plumbing track and Scouts' Handyman merit badge.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Vocational plumbing shop class, if offered",
      description: "Named directly as the foundational coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA (plumbing track)",
      description: "SkillsUSA runs a real, named plumbing-specific competitive track.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Boy/Girl Scouts — Handyman merit badge",
      description: "Named directly as real, relevant preparation for this trade.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Apply to a plumbing/pipefitting apprenticeship",
      description: "The named, real next step for this track after high school — apprenticeships typically run 4-5 years.",
    },
  ],
};
