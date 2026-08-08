import type { CareerTrackTemplate } from "@/types/roadmap";

export const entrepreneurship: CareerTrackTemplate = {
  track: "entrepreneurship",
  label: "Entrepreneurship & Startups",
  summary:
    "Entrepreneurs build businesses — any major works, MBA optional. This track centers on real, named programs (NFTE, DECA Innovation, Junior Achievement Company Program) rather than generic 'start a business' advice.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Learn business basics via FBLA/DECA",
      description: "FBLA and DECA both run real business-fundamentals programming for freshmen.",
    },
    {
      gradeLevel: "grade_9",
      category: "experience",
      title: "Start a club or small business (e.g. a lawn-care service or bake sale)",
      description: "A small, real, student-run business or club is the classic and most credible starting move for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Junior Achievement Company Program",
      description: "JA's Company Program is a real, named, structured student-business program.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "NFTE (Network for Teaching Entrepreneurship) program",
      description: "NFTE is a real, named national entrepreneurship-education organization worth applying to.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "DECA Innovation competitive events",
      description: "DECA's Innovation category is the named, real competitive track for entrepreneurship specifically.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "Read 'The Lean Startup'; follow entrepreneurship podcasts (e.g. 'How I Built This')",
      description: "Named, real media resources to build startup literacy alongside the hands-on work.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Grow the student business or launch a second venture",
      description: "Demonstrated growth or a second venture is the strongest capstone evidence for this track — colleges and employers want to see follow-through, not just a one-off project.",
    },
  ],
};
