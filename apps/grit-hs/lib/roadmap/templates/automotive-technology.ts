import type { CareerTrackTemplate } from "@/types/roadmap";

export const automotiveTechnology: CareerTrackTemplate = {
  track: "automotive_technology",
  label: "Automotive Technology",
  summary:
    "Automotive technicians repair vehicles — a 2-year tech school or apprenticeship. This track uses real named auto-shop coursework, FFA's agricultural-machinery track, and ASE certification.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Auto shop class begins",
      description: "Named directly as the core foundational coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "FFA (agricultural machinery track)",
      description: "FFA's agricultural-machinery track is named directly as relevant — mechanical skill transfers directly to automotive work.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "ASE certification track begins",
      description: "ASE (Automotive Service Excellence) certification is the real, named, industry-standard credential for this field.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Enroll in a 2-year automotive technical program or apprenticeship",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
