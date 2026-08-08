import type { CareerTrackTemplate } from "@/types/roadmap";

export const supplyChainManagement: CareerTrackTemplate = {
  track: "supply_chain_management",
  label: "Supply Chain Management",
  summary:
    "Supply chain managers coordinate logistics, procurement, and operations. Source material for this track is a brief parenthetical (business classes, DECA/FBLA, internships at companies) rather than an individually detailed pathway — this roadmap reflects that honestly.",
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
      title: "Statistics or Economics electives",
      description: "Both feed directly into logistics/operations analysis.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Internship at a company's operations or logistics department",
      description: "The source material specifically names internships at companies as key preparation for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Map or optimize a real process (e.g. a school event's logistics)",
      description: "A hands-on logistics-optimization project — even something as small as coordinating a school event — demonstrates applied supply-chain thinking.",
    },
  ],
};
