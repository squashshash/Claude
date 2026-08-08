import type { CareerTrackTemplate } from "@/types/roadmap";

export const publicPolicyAdministration: CareerTrackTemplate = {
  track: "public_policy_administration",
  label: "Public Policy & Public Administration",
  summary:
    "Public policy and public administration roles span state/federal government and administrative leadership. Source material for this track is a brief parenthetical (emphasize social studies and community involvement in high school) rather than an individually detailed pathway — this roadmap reflects that honestly, drawing on the same social-studies foundation as the Law/Public Policy and Urban Planning tracks.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP U.S. History or Government track begins",
      description: "Strong social-studies coursework is the named foundation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join Model UN, Youth & Government, or a similar civics program",
      description: "Civics-focused extracurriculars build directly relevant experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Community involvement — volunteer with a local government office or civic organization",
      description: "The source material specifically emphasizes community involvement in high school as core preparation for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Intern with a local, state, or federal government office, if available",
      description: "A government-office internship is the strongest direct-exposure evidence for this track, where one is available to a high schooler.",
    },
  ],
};
