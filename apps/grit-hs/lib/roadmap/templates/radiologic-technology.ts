import type { CareerTrackTemplate } from "@/types/roadmap";

export const radiologicTechnology: CareerTrackTemplate = {
  track: "radiologic_technology",
  label: "Radiologic Technology",
  summary:
    "Radiologic technologists operate imaging equipment (X-ray, CT, MRI). Source material names radiology-tech-specific summer academies as a real prep category, but no individual program was independently verified — this roadmap points toward that category rather than a specific name.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Rigorous science coursework begins",
      description: "Biology and Physics — imaging technology relies on physics fundamentals as much as biology.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join HOSA",
      description: "The shared allied-health extracurricular pipeline.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Physics",
      description: "Continue toward Physics — directly relevant to imaging equipment operation.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Attend a radiology tech academy or shadow at an imaging center",
      description: "Radiology-tech-specific summer academies exist — research current, accredited options near you, or shadow at a local imaging center.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Volunteer or intern in a clinical imaging department",
      description: "Direct exposure to a hospital or clinic imaging department builds a real application record ahead of an accredited radiologic technology program.",
    },
  ],
};
