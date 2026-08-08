import type { CareerTrackTemplate } from "@/types/roadmap";

export const maritimeOperations: CareerTrackTemplate = {
  track: "maritime_operations",
  label: "Maritime Operations",
  summary:
    "Ship/cargo officers work on ships — a Maritime academy (4 yr) or apprenticeship. This track uses the real named Sea Scouts program and NOAA's youth camps.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Math/Physics track begins",
      description: "Named directly as relevant academic preparation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Swim lessons / water-safety certification",
      description: "Named directly as relevant, practical preparation for a maritime career.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Sea Scouts",
      description: "Sea Scouts is a real, named youth maritime program — a direct pipeline into this field.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "NOAA youth camp",
      description: "NOAA runs real, named youth maritime/ocean-science camps worth attending before applying to a maritime academy or apprenticeship.",
    },
  ],
};
