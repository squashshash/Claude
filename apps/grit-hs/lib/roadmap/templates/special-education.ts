import type { CareerTrackTemplate } from "@/types/roadmap";

export const specialEducation: CareerTrackTemplate = {
  track: "special_education",
  label: "Special Education",
  summary:
    "Special education teachers work with students with disabilities — a Bachelor's in Education plus a special-education credential. Source material for this track is a brief parenthetical (volunteer work with children, language clubs, AP Psychology) rather than an individually detailed pathway — this roadmap reflects that honestly, drawing on the shared foundation with K-12 Teaching.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Psychology track begins",
      description: "Named directly as relevant coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join a language club, if relevant to a bilingual-education interest",
      description: "Language clubs are named as relevant, particularly for students interested in bilingual special education.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Volunteer work with children with disabilities",
      description: "Named directly as the core, most relevant preparation for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Continue volunteer work in an increased-responsibility role",
      description: "Sustained, escalating volunteer work with children is the strongest evidence of readiness for this track heading into an Education degree.",
    },
  ],
};
