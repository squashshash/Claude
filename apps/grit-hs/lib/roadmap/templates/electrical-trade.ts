import type { CareerTrackTemplate } from "@/types/roadmap";

export const electricalTrade: CareerTrackTemplate = {
  track: "electrical_trade",
  label: "Electrical Trade",
  summary:
    "Electricians install and repair electrical systems — a high school diploma plus a 4-5 year apprenticeship or vocational school. This track uses the real SkillsUSA electronics track and named OSHA safety certification.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Vocational tech class (electronics), if offered",
      description: "Vocational electronics coursework is the named, direct foundation for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join SkillsUSA (electronics track)",
      description: "SkillsUSA's electronics track is the real, named competitive pipeline for this field.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Applied Math Club (electrical wiring math)",
      description: "Named directly as relevant — electrical work depends on applied math for wiring calculations.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "FIRST Robotics (electrical wiring)",
      description: "FIRST Robotics teams need real electrical wiring work — a hands-on, named way to build directly relevant skill.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "OSHA safety certification",
      description: "OSHA safety certification is a real, named, obtainable-in-high-school credential for this trade.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Commercial Driver's License, if useful for your local union/employer",
      description: "Named as a useful (not required) supplementary credential in some markets.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Apply to an electrician apprenticeship or vocational school",
      description: "The named, real next step for this track after high school — apprenticeship programs are typically 4-5 years and often union-run.",
    },
  ],
};
