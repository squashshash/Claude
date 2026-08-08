import type { CareerTrackTemplate } from "@/types/roadmap";

export const realEstate: CareerTrackTemplate = {
  track: "real_estate",
  label: "Real Estate",
  summary:
    "Real estate careers span brokerage, development, and property management. Source material for this track is a brief parenthetical (business classes, DECA/FBLA, internships at companies) rather than an individually detailed pathway — this roadmap reflects that honestly.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Business coursework begins",
      description: "Take general Business classes as your school offers them.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join DECA or FBLA",
      description: "Both are named, real business-CTSOs applicable to this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Economics electives",
      description: "Economics coursework builds the market-analysis skill real estate work depends on.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Internship or shadowing at a real estate firm or with a broker",
      description: "The source material specifically names internships at companies as key preparation — a real estate firm or broker is the directly relevant version.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Research your state's real estate licensing requirements",
      description: "Real estate licensing is state-specific — research your own state's requirements directly rather than relying on a generic national answer.",
    },
  ],
};
