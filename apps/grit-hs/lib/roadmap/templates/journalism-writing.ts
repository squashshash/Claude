import type { CareerTrackTemplate } from "@/types/roadmap";

export const journalismWriting: CareerTrackTemplate = {
  track: "journalism_writing",
  label: "Journalism & Writing",
  summary:
    "Authors and journalists write for publication. Source material for this track is a brief parenthetical (English courses, school newspaper) rather than an individually detailed pathway — this roadmap reflects that honestly.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP English track begins",
      description: "Strong English coursework is the named foundation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join the school newspaper or literary magazine",
      description: "Named, real, direct writing-and-publishing experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Submit to student writing competitions (e.g. Scholastic Art & Writing Awards)",
      description: "Scholastic Art & Writing Awards runs a real, named writing category alongside its art categories.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Build a writing portfolio and pursue a byline (school paper, local outlet, or blog)",
      description: "Published work — even a school-paper byline or a consistently updated blog — is the strongest application item for this track.",
    },
  ],
};
