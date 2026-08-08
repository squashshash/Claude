import type { CareerTrackTemplate } from "@/types/roadmap";

export const masonryTrade: CareerTrackTemplate = {
  track: "masonry_trade",
  label: "Masonry & Heavy Equipment",
  summary:
    "Masons and bricklayers build structures with brick, stone, and concrete. Source material for this track is a brief parenthetical (high-school math and shop courses, trade clubs/competitions, apprenticeships) rather than an individually detailed pathway — this roadmap reflects that honestly, drawing on the shared Construction & Carpentry foundation.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Shop and applied-math coursework begins",
      description: "Named directly as the shared foundation across skilled trades.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA masonry track, if offered",
      description: "SkillsUSA runs masonry-adjacent competitive tracks in many regions.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Shadow or assist on a real masonry job site, if possible",
      description: "Direct hands-on exposure is the most valuable preparation this thin source material points toward.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Apply to a masonry apprenticeship",
      description: "The named, real next step for this track after high school.",
    },
  ],
};
