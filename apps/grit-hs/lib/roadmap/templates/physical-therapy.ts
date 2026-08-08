import type { CareerTrackTemplate } from "@/types/roadmap";

export const physicalTherapy: CareerTrackTemplate = {
  track: "physical_therapy",
  label: "Physical Therapy",
  summary:
    "PTs help patients recover mobility — a Doctor of Physical Therapy (3 yr) after a Bachelor's, ~7 years total. This track leans on sports-medicine club involvement and youth-sports-first-aid certification, since PT prep overlaps heavily with athletics.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Biology foundations",
      description: "Build a general Biology foundation ahead of Anatomy and Physics coursework.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Biology, intro Anatomy",
      description: "Take Biology and any available intro Anatomy coursework.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a sports medicine club or become a certified student trainer",
      description: "Sports-medicine clubs and student-athletic-trainer certification are the core PT-track extracurricular per available guidance.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Physics",
      description: "Add Physics to the coursework — biomechanics-relevant for PT programs.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer coaching or work at a rehab center",
      description: "Start volunteer coaching or shadowing/volunteering at a physical-rehab center.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "Youth sports first aid and CPR certification",
      description: "Complete youth-sports first-aid and CPR certification — directly relevant, real credentials for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "PT summer camp (e.g. a university biomechanics camp)",
      description: "Attend a PT-focused summer camp, such as a university biomechanics program.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Internship at a rehab clinic",
      description: "Take on an internship or extended volunteer role at a rehab clinic before applying to undergraduate pre-PT programs.",
    },
  ],
};
