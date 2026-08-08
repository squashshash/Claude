import type { CareerTrackTemplate } from "@/types/roadmap";

export const dentistry: CareerTrackTemplate = {
  track: "dentistry",
  label: "Dentistry (DDS/DMD)",
  summary:
    "Dentists treat oral health — DDS/DMD dental school plus an optional residency. This track front-loads AP Biology/Chemistry and dental-specific club exposure (HOSA dental events) so a real dental-assisting certification and shadowing hours are in place before senior year.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Biology & Chemistry foundations",
      description: "Build the science base — general Biology and Chemistry — before AP-level coursework begins.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Biology track begins",
      description: "Enroll in AP Biology as soon as it's offered; dental schools weight science GPA heavily.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join HOSA (dental science events)",
      description: "HOSA has dedicated dental-science competitive events — join as a freshman to start building toward them.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Chemistry, Physics",
      description: "Continue the science sequence with AP Chemistry and Physics.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Science Olympiad (dental/health events)",
      description: "Compete in Science Olympiad's health-science-adjacent events.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Shadow dentists; volunteer at free dental clinics",
      description: "Start shadowing practicing dentists and volunteering at free/community dental clinics.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "Dental assisting certification",
      description: "Pursue a dental-assisting certification if available through your school or a local program.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "ADA summer dental camp",
      description: "Attend an ADA-affiliated summer dental camp or a local dental-camp program.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "3D-printed dental models / dental anatomy portfolio",
      description: "Build a portfolio project — 3D-printed dental models or a dental-anatomy study — to show hands-on interest for applications.",
    },
    {
      gradeLevel: "grade_12",
      category: "academics",
      title: "Finalize pre-dental coursework, apply with a verified shadowing record",
      description:
        "Enter college pre-dental with AP Bio/Chem/Physics complete, a dental-assisting credential (if pursued), and a documented shadowing/volunteering history at dental clinics.",
    },
  ],
};
