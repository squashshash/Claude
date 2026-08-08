import type { CareerTrackTemplate } from "@/types/roadmap";

export const physicianAssistant: CareerTrackTemplate = {
  track: "physician_assistant",
  label: "Physician Assistant",
  summary:
    "PAs diagnose and treat patients under MD supervision — Master's (2-3 yr) after a Bachelor's, ~6-7 years post-high-school total. AAMC's own pre-health guidance (volunteer positions at hospitals/clinics, shadowing physicians) applies directly here, same as pre-med.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Biology & Chemistry foundations",
      description: "Build the science base ahead of the AP science sequence.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP science sequence begins",
      description: "Start AP sciences (Biology/Chemistry) as early as your school allows — similar rigor to pre-med.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join HOSA",
      description: "HOSA is the key extracurricular pipeline for PA-track students, per AAMC guidance.",
    },
    {
      gradeLevel: "grade_10",
      category: "certifications",
      title: "EMT certification pathway begins",
      description: "Start toward EMT certification — a common, recognized credential for PA-track students to gain patient-care hours.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer positions at hospitals or clinics",
      description: "AAMC specifically recommends volunteer positions at hospitals or clinics for this track — start building that record.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "Continue AP sciences",
      description: "Keep the AP science course load rigorous through junior year.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Shadow physicians",
      description: "AAMC guidance for this track explicitly calls out shadowing physicians as a key preparation step.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Medical scribe or tech work (phlebotomy, ward aide)",
      description: "Take on medical-scribe or clinical-tech work — phlebotomy or ward-aide roles are common entry points that build real patient-contact hours.",
    },
  ],
};
