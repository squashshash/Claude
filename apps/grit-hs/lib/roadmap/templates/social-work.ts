import type { CareerTrackTemplate } from "@/types/roadmap";

export const socialWork: CareerTrackTemplate = {
  track: "social_work",
  label: "Social Work & Nonprofit Management",
  summary:
    "Social workers and nonprofit managers help communities — a B.A. in Social Work (4 yr), often followed by an M.S.W. for clinical practice. This track uses named community-service organizations (Key Club, Habitat for Humanity) and a real gradual-responsibility volunteering arc.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Psychology coursework, if offered",
      description: "Psychology is directly named as core coursework for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join Key Club",
      description: "Key Club is a real, named service-club entry point for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Sociology coursework, if offered",
      description: "Sociology is directly named as core coursework for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer at a community center",
      description: "Community-center volunteering is the named, real starting point for this track's hands-on experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Habitat for Humanity or a similar service organization",
      description: "Habitat for Humanity is directly named as a real, well-known organization for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Take on increased responsibility in a volunteer organization",
      description: "The source material specifically emphasizes gradually increasing responsibility in volunteer orgs over the four years, rather than one-off events, as the strongest evidence for this track.",
    },
  ],
};
