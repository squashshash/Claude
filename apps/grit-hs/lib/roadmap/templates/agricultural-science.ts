import type { CareerTrackTemplate } from "@/types/roadmap";

export const agriculturalScience: CareerTrackTemplate = {
  track: "agricultural_science",
  label: "Agricultural Science",
  summary:
    "Agricultural scientists (agronomists, horticulturists) develop better crops — a B.S. in Agricultural Science. This track uses the real named 4-H research pipeline and university youth research programs in plant science.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Biology/Chemistry track begins",
      description: "Named directly as the academic foundation for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join 4-H",
      description: "4-H is the real, named pipeline for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Agricultural classes, if offered",
      description: "Named directly as relevant coursework for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "State university youth research program in plant science",
      description: "Named directly as a real, relevant research opportunity — many state universities run these specifically for high schoolers.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Complete an independent plant-science research project",
      description: "A completed research project, ideally connected to the university program above, is the strongest portfolio anchor for this track.",
    },
  ],
};
