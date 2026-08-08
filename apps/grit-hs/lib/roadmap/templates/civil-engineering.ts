import type { CareerTrackTemplate } from "@/types/roadmap";

export const civilEngineering: CareerTrackTemplate = {
  track: "civil_engineering",
  label: "Civil Engineering",
  summary:
    "Civil engineers plan and design infrastructure — a 4-year ABET-accredited Bachelor's. This track uses real named competitions (Concrete Canoe, ACE Mentor Program, SUMMER Bridge at UT Austin) rather than generic engineering-club advice.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Algebra II, Geometry foundations",
      description: "Build the math foundation the AP sequence below depends on.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Physics track begins",
      description: "Start toward AP Physics, AP Calculus, and Chemistry as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a robotics/construction club (e.g. SkillsUSA carpentry track)",
      description: "SkillsUSA's carpentry/construction track is a real, named entry point for civil-engineering-adjacent hands-on skills.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Concrete Canoe or bridge-building competition",
      description: "Concrete Canoe competitions and bridge-building contests are real, named civil-engineering-specific competitions to target.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Mathletes / applied-math competitions",
      description: "Mathletes-style competitions build the applied-math skill civil engineering depends on.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "AP Physics, AP Calculus, Chemistry",
      description: "Full junior-year science/math load: Physics, Calculus, Chemistry.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "ACE Mentor Program",
      description: "The ACE (Architecture, Construction, Engineering) Mentor Program is a real, named national mentorship pipeline for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "SUMMER Bridge program (UT Austin) or a local Dept. of Transportation internship",
      description: "SUMMER Bridge at the University of Texas is a real, named summer program; local Departments of Transportation also run internships worth pursuing.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Design model bridges/roads; GIS mapping project",
      description: "Build a portfolio project — model bridge/road design, or a GIS (Geographic Information Systems) mapping project.",
    },
    {
      gradeLevel: "grade_12",
      category: "ctso",
      title: "ASCE student chapter involvement, Model UN (urban planning interest)",
      description: "ASCE (American Society of Civil Engineers) runs student chapters; Model UN is noted as relevant for students with an urban-planning bent.",
    },
  ],
};
