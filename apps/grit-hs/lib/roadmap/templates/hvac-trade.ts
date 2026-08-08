import type { CareerTrackTemplate } from "@/types/roadmap";

export const hvacTrade: CareerTrackTemplate = {
  track: "hvac_trade",
  label: "HVAC Trade",
  summary:
    "HVAC technicians install heating/cooling systems — a 2-year technical diploma. This track uses the real named SkillsUSA HVAC track and EPA certification (legally required for handling refrigerants).",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Physics coursework begins",
      description: "Physics is named directly as relevant — HVAC systems rely on thermodynamics fundamentals.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Vocational classes begin",
      description: "General vocational-technical coursework builds toward the HVAC-specific track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA (HVAC track)",
      description: "SkillsUSA runs a real, named HVAC-specific competitive track.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "EPA certification track begins",
      description: "EPA certification is a real, legally required credential for handling refrigerants in this field — start researching the requirements now.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Enroll in a 2-year HVAC technical diploma program",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
