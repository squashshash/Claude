import type { CareerTrackTemplate } from "@/types/roadmap";

export const appliedStatistics: CareerTrackTemplate = {
  track: "applied_statistics",
  label: "Applied Statistics",
  summary:
    "Statisticians apply statistics to real-world problems — a B.S. in Statistics or Math. This track uses the real Kaggle competition circuit and named media resources (FiveThirtyEight, Data Skeptic) as literacy-building, distinct from the Data Science track's industry/certification focus.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Statistics track begins",
      description: "Start toward AP Statistics as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a Math team",
      description: "A school Math team is the named, real competitive entry point for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Calculus, Computer Science",
      description: "Both build the applied-math and coding foundation this track depends on.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Kaggle competitions",
      description: "The real, named competitive-data-science circuit — shared with the Data Science track but approached here from a statistics-literacy angle.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Follow FiveThirtyEight and the Data Skeptic podcast",
      description: "Both are real, named media resources specifically for building applied-statistics literacy.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Analyze public datasets (elections, climate data) and publish findings",
      description: "A published, real analysis of public data — elections or climate data are named examples — is the strongest portfolio anchor for this track.",
    },
  ],
};
