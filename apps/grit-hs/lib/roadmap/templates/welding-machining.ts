import type { CareerTrackTemplate } from "@/types/roadmap";

export const weldingMachining: CareerTrackTemplate = {
  track: "welding_machining",
  label: "Welding & Machining",
  summary:
    "Welders/machinists fabricate metal parts — a 2-year technical program. This track uses the real named SkillsUSA welding track and AWS (American Welding Society) certification.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Welding shop classes, if offered",
      description: "Named directly as the core foundational coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA (welding track)",
      description: "SkillsUSA runs a real, named welding-specific competitive track.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "AWS welding certification track begins",
      description: "American Welding Society certification is the real, named, industry-standard credential for this field.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Enroll in a 2-year welding/machining technical program",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
