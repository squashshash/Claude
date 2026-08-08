import type { CareerTrackTemplate } from "@/types/roadmap";

export const judicialClerk: CareerTrackTemplate = {
  track: "judicial_clerk",
  label: "Judicial Clerkship & the Judiciary",
  summary:
    "Judges preside over and clerks assist in court proceedings — this requires a law degree plus practice experience, so high-school prep is essentially identical to the Law/Public Policy track. Source material for this specific specialization is brief (it explicitly says 'same as lawyer'), so this roadmap stays honest about that overlap rather than inventing judiciary-specific detail that doesn't exist yet at the high-school level.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP U.S. History, Government, English track begins",
      description: "Same rigorous humanities/social-studies foundation as the Law/Public Policy track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join Mock Trial or Debate",
      description: "Mock Trial and Debate are the most directly relevant extracurriculars — the source material specifically calls out participation in debate/mock trial as critical preparation.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Court observation / ride-along, if available",
      description: "Observing real court proceedings, where a local court allows it, is the closest hands-on exposure available at the high-school level.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Serve as a teaching assistant or peer tutor",
      description: "The source material specifically notes that teaching-assistant or peer-tutoring roles in senior year can show leadership relevant to this track.",
    },
  ],
};
