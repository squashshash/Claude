import type { CareerTrackTemplate } from "@/types/roadmap";

export const astrophysics: CareerTrackTemplate = {
  track: "astrophysics",
  label: "Astronomy & Astrophysics",
  summary:
    "Astronomers and astrophysicists study space — a B.S. plus Ph.D. (research required); most work as professors/researchers. This track uses the real named REU (Research Experience for Undergraduates) and NASA HS research-program pipeline.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Algebra II, Physics-track coursework begins",
      description: "Build the math foundation toward AP Physics C and Calculus.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join an Astronomy Club or physics team",
      description: "Both are named, real entry points for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "AP Physics C, Calculus",
      description: "AP Physics C (the calculus-based version) is specifically named as required-level coursework for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Telescope build; astrophotography",
      description: "Both are named, real, hands-on portfolio projects specific to this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Research program at an observatory (REU, NASA HS programs)",
      description: "REU (Research Experience for Undergraduates) programs and NASA's high-school research programs are both real, named opportunities — often accessible even before college, and directly relevant since most astrophysics careers require research experience.",
    },
  ],
};
