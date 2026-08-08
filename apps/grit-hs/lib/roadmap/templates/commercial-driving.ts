import type { CareerTrackTemplate } from "@/types/roadmap";

export const commercialDriving: CareerTrackTemplate = {
  track: "commercial_driving",
  label: "Commercial Driving (CDL)",
  summary:
    "Truck and bus drivers transport goods and passengers — a high school diploma plus Commercial Driver's License (CDL) training. This track centers on the named Career/Tech (CPT) logistics coursework and building a clean driving record.",
  milestones: [
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Career/Tech (CPT) logistics coursework, if offered",
      description: "Career and Technical Education logistics coursework is named directly as relevant preparation for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Build and maintain a clean driving record",
      description: "A clean driving record is named directly as core to CDL eligibility — this matters from the moment you get a learner's permit.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Develop mechanical interest — basic vehicle maintenance",
      description: "Named directly as relevant background knowledge for this track, even though it's not a formal requirement.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Research CDL training (CDD courses) programs",
      description: "Commercial Driver's License training programs are the named, real next step after high school for this track.",
    },
  ],
};
