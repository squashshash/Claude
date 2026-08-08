import type { CareerTrackTemplate } from "@/types/roadmap";

export const dataScience: CareerTrackTemplate = {
  track: "data_science",
  label: "Data Science",
  summary:
    "Data scientists analyze large datasets to inform decisions — Bachelor's plus often a Master's. This track uses the real Kaggle high-school hackathon circuit and named certifications (Google Data Analytics, Kaggle micro-credentials) rather than generic 'learn Python' advice.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Algebra II, intro statistics concepts",
      description: "Build the math foundation ahead of AP Statistics and Calculus.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Statistics track begins",
      description: "Start toward AP Statistics as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a Math Club (AMC — American Mathematics Competitions)",
      description: "AMC is the named, real competitive-math pipeline for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Calculus, Computer Science",
      description: "Add AP Calculus and Computer Science coursework.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Kaggle high-school hackathon",
      description: "The Kaggle HS hackathon circuit is a real, named data-science-specific competition target.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "ICS (Interscholastic Computing) team",
      description: "ICS teams give applied programming/data competition experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "Google Data Analytics certificate",
      description: "A real, industry-recognized entry-level certification for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Kaggle micro-credentials",
      description: "Kaggle's own micro-credential courses build a verifiable, named credential trail.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Analyze a real dataset (e.g. COVID or sports stats) and publish findings",
      description: "A published analysis of a real public dataset is the strongest portfolio anchor for this track.",
    },
  ],
};
