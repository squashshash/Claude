import type { CareerTrackTemplate } from "@/types/roadmap";

export const musicComposition: CareerTrackTemplate = {
  track: "music_composition",
  label: "Music & Composition",
  summary:
    "Musicians and composers write and perform music. Source material for this track is a brief parenthetical (music courses, choir, band, music camps) rather than an individually detailed pathway — this roadmap reflects that honestly.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Music theory / band / choir coursework begins",
      description: "Formal music coursework — theory, band, or choir — is the named foundation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join a school ensemble (band, choir, or orchestra)",
      description: "Named, real, direct performance experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Attend a music summer camp",
      description: "Music camps are named as real, relevant summer preparation for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Compose and record an original piece; build a performance portfolio",
      description: "Original composition and a recorded performance portfolio are the strongest application items for a music program.",
    },
  ],
};
