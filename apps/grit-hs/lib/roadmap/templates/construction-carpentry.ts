import type { CareerTrackTemplate } from "@/types/roadmap";

export const constructionCarpentry: CareerTrackTemplate = {
  track: "construction_carpentry",
  label: "Construction & Carpentry",
  summary:
    "Carpenters build structures — an apprenticeship or vocational school. This track uses the real named SkillsUSA carpentry track, FFA's shop projects, and YMCA youth building programs.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Woodshop/Metalshop classes",
      description: "Named directly as the core foundational coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA (carpentry track)",
      description: "SkillsUSA runs a real, named carpentry-specific competitive track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "FFA (shop projects)",
      description: "FFA's shop-project events are named directly as relevant to this track, even outside a strictly agricultural context.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "YMCA youth building programs",
      description: "Named directly as a real, hands-on community building program.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Apply to a carpentry apprenticeship or vocational school",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
