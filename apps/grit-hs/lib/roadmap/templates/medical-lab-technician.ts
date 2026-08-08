import type { CareerTrackTemplate } from "@/types/roadmap";

export const medicalLabTechnician: CareerTrackTemplate = {
  track: "medical_lab_technician",
  label: "Medical Lab Technician",
  summary:
    "Medical lab technicians run diagnostic tests on patient samples. Source material gives shared allied-health guidance rather than lab-tech-specific programs — this roadmap emphasizes the lab-science coursework and hands-on lab experience that clearly transfers.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Rigorous science coursework begins",
      description: "Biology and Chemistry, with an emphasis on lab technique.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join HOSA or a school BioClub",
      description: "The shared allied-health extracurricular pipeline.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Continue Chemistry, add lab-based electives",
      description: "Prioritize any lab-based science electives your school offers.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Volunteer or shadow in a clinical or research lab",
      description: "Direct lab exposure — clinical or research — builds the most relevant experience for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Research medical-lab-technician-specific programs",
      description:
        "Do targeted research into accredited medical lab technician programs and any local internship pipelines — not independently verified in this roadmap yet.",
    },
  ],
};
