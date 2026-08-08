import type { CareerTrackTemplate } from "@/types/roadmap";

export const publicHealth: CareerTrackTemplate = {
  track: "public_health",
  label: "Public Health",
  summary:
    "Public health specialists work on population-level health outcomes. Source material gives shared allied-health guidance — this roadmap adds the community/policy angle that distinguishes public health from clinical allied-health tracks.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Rigorous science coursework begins",
      description: "Biology as the core science foundation.",
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
      title: "Statistics or AP Statistics, if offered",
      description: "Public health leans heavily on data/statistics — start that coursework as early as it's available.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Volunteer with a community health organization",
      description: "Public-health-specific experience is community/population-focused, not just clinical — a community health organization is the most relevant volunteer setting.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Research public-health-specific summer programs",
      description:
        "Do targeted research into public-health-specific summer programs (many universities run them) — not independently verified in this roadmap yet.",
    },
  ],
};
