import type { CareerTrackTemplate } from "@/types/roadmap";

export const electricalComputerEngineering: CareerTrackTemplate = {
  track: "electrical_computer_engineering",
  label: "Electrical & Computer Engineering",
  summary:
    "ECE develops electrical systems and hardware — B.S. ECE. IEEE's own recommendation (basic coding plus robotics/hackathon contests) anchors this track, alongside named programs like Stanford AI4ALL and Berkeley Pre-Engineering.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Algebra II, intro coding",
      description: "Build math and basic-coding foundations ahead of AP Physics/Calculus/CS.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Physics, AP Calculus track begins",
      description: "Start toward AP Physics and AP Calculus as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a robotics team",
      description: "IEEE specifically suggests basic coding and joining a robotics team as the entry point for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Computer Science",
      description: "Add AP Computer Science to the course load.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Hackathons; Electronics Olympiad",
      description: "IEEE suggests hackathon participation; Electronics Olympiad is a real, named competition for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "ACM 10th-grade programming contests, FIRST Robotics (control-systems focus)",
      description: "ACM's 10th-grade-level contests and FIRST Robotics (with a focus on control systems) are named, real competition targets.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Pre-college program: Stanford AI4ALL or Berkeley Pre-Engineering",
      description: "Stanford's AI4ALL and Berkeley's Pre-Engineering program are real, named pre-college summer programs for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Build and program a microcontroller (Arduino) gadget",
      description: "A hands-on Arduino microcontroller build is the portfolio-project anchor for ECE applications.",
    },
    {
      gradeLevel: "grade_12",
      category: "ctso",
      title: "IEEE Student Branch involvement",
      description: "Join an IEEE Student Branch chapter as a capstone extracurricular before college applications.",
    },
  ],
};
