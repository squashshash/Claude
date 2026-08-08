import type { CareerTrackTemplate } from "@/types/roadmap";

export const forestryParkManagement: CareerTrackTemplate = {
  track: "forestry_park_management",
  label: "Forestry & Park Management",
  summary:
    "Foresters and park rangers manage forests and parks — a B.S. in Forestry or Environmental Science. This track uses the real named Scouts conservation pipeline (Eagle Scout projects are often conservation-based) and trail-maintenance volunteering.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Environmental Science, Biology track begins",
      description: "Named directly as the academic foundation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join Scouts (conservation focus)",
      description: "Scouts' conservation-project track is named directly — Eagle Scout projects are frequently conservation-based, a real, verifiable credential.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Trail maintenance volunteering",
      description: "Named directly as real, hands-on preparation for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Park volunteer program",
      description: "Named directly as a real, direct entry point into park-service work ahead of a Forestry or Environmental Science degree.",
    },
  ],
};
