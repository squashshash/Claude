import type { CareerTrackTemplate } from "@/types/roadmap";

export const agribusinessManagement: CareerTrackTemplate = {
  track: "agribusiness_management",
  label: "Agribusiness Management",
  summary:
    "Farmers and agribusiness managers run farm operations — often a Bachelor's in Agriculture/Agribusiness (4 yr), or a vocational path. This track uses the real named FFA (Future Farmers of America) and 4-H pipelines, plus a concrete school/community garden project.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join FFA (Future Farmers of America)",
      description: "FFA is the real, named, direct pipeline for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join 4-H",
      description: "4-H is a second real, named, direct pipeline, often overlapping with FFA.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Biology, Environmental Science",
      description: "Both build the science foundation agribusiness management depends on.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Run a school or community garden, or a 4-H livestock project",
      description: "Both are named, real, hands-on projects specific to this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Pesticide applicator certification",
      description: "A real, named, industry-relevant credential for this track.",
    },
  ],
};
