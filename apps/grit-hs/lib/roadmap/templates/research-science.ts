import type { CareerTrackTemplate } from "@/types/roadmap";

export const researchScience: CareerTrackTemplate = {
  track: "research_science",
  label: "Research Science (Biology, Chemistry, Physics)",
  summary:
    "Research biologists, chemists, and physicists conduct scientific research — a Bachelor's, typically a Ph.D. for research roles. This track uses the real Science Olympiad / Intel ISEF science-fair pipeline and named research programs (Google Science Fair, MITES).",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Biology, Chemistry, or Physics track begins",
      description: "Start the AP science sequence in whichever field most interests you — this track supports all three.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join Science Olympiad (chem lab or bio lab events)",
      description: "Science Olympiad's lab-focused events are the named, real competitive pipeline for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Science Fair — target the Intel ISEF track",
      description: "Intel ISEF (International Science and Engineering Fair) is the named, real top-tier science-fair pipeline to aim for.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join a Robotics club (programming for automation)",
      description: "Automation programming is named as relevant, cross-disciplinary experience for research science.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Research summer program (Google Science Fair, MITES in biology, etc.)",
      description: "Google Science Fair and MIT's MITES program are both named, real research-summer opportunities.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Participate in a local university lab's high-school research program",
      description: "Many universities run named high-school research programs — a real, direct research-lab entry point.",
    },
    {
      gradeLevel: "grade_12",
      category: "ctso",
      title: "Join a science club (e.g. Tri-β Biology honor society) or a local science society",
      description: "Tri-β is a real, named biology honor society; local science societies serve the same purpose in other fields.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Compete in science fairs with a completed lab project",
      description: "A completed, competition-ready lab project is the capstone evidence for this track heading into a Bachelor's program.",
    },
  ],
};
