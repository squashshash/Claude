import type { CareerTrackTemplate } from "@/types/roadmap";

export const heavyEquipmentOperation: CareerTrackTemplate = {
  track: "heavy_equipment_operation",
  label: "Heavy Equipment Operation",
  summary:
    "Heavy equipment operators run cranes, excavators, and other construction machinery. Source material for this track is a brief parenthetical (high-school math and shop courses, trade clubs/competitions, apprenticeships) rather than an individually detailed pathway — this roadmap reflects that honestly.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Shop and applied-math coursework begins",
      description: "Named directly as the shared foundation across skilled trades.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Build mechanical familiarity — auto shop or equivalent hands-on coursework",
      description: "Mechanical familiarity transfers directly to heavy-equipment operation.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Research your state's heavy-equipment operator certification requirements",
      description: "Certification requirements are state- and equipment-type-specific — research directly rather than relying on a generic national answer.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Apply to a heavy-equipment operator apprenticeship or training program",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
