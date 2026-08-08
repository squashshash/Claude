import type { CareerTrackTemplate } from "@/types/roadmap";

export const foodScience: CareerTrackTemplate = {
  track: "food_science",
  label: "Food Science",
  summary:
    "Food scientists/technicians work on food safety — a B.S. in Food Science or Chemistry. This track leans on the shared Chemistry/Biology foundation plus a real, named dairy-farm or food-lab internship path.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Chemistry coursework begins",
      description: "Named directly as core preparation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Biology",
      description: "Named directly alongside Chemistry as the academic foundation for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Join FFA or a school Science Club",
      description: "FFA connects directly to food-production science; a general Science Club also applies.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Internship at a dairy farm or food lab",
      description: "Named directly as the real, concrete internship path for this track ahead of a Food Science or Chemistry degree.",
    },
  ],
};
