import type { CareerTrackTemplate } from "@/types/roadmap";

export const militaryOfficer: CareerTrackTemplate = {
  track: "military_officer",
  label: "Military Officer",
  summary:
    "Military officers hold leadership roles in the armed forces. This track centers on the real JROTC-to-ROTC pipeline and named service academy summer programs — most officer majors are Engineering or International Relations, per the source material.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join Junior Reserve Officers' Training Corps (JROTC)",
      description: "JROTC is the real, named, direct pipeline into a military-officer track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Athletics for physical fitness",
      description: "Physical fitness is a named, direct requirement throughout an officer track — team athletics build toward it.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "ASVAB test prep",
      description: "The Armed Services Vocational Aptitude Battery (ASVAB) is the real, named entrance exam to start preparing for.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Service academy summer program (USMA, USNA)",
      description: "West Point (USMA) and the Naval Academy (USNA) both run real, named summer programs for prospective applicants.",
    },
    {
      gradeLevel: "grade_12",
      category: "academics",
      title: "Apply for ROTC scholarship or a service academy",
      description: "Most officer-track majors are Engineering or International Relations, per the source material — align senior-year academics accordingly before applying.",
    },
  ],
};
