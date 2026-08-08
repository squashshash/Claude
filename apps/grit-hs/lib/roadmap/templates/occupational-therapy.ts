import type { CareerTrackTemplate } from "@/types/roadmap";

export const occupationalTherapy: CareerTrackTemplate = {
  track: "occupational_therapy",
  label: "Occupational Therapy",
  summary:
    "Occupational therapists help patients regain everyday functional skills. The source material for this track is lighter than the flagship pathways — it names the same core prep as other allied-health careers (rigorous science, HOSA, clinic exposure) without OT-specific certifications or programs, so this roadmap stays intentionally general rather than inventing specifics.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Rigorous science coursework begins",
      description: "Start building a strong science course load (Biology, and AP sciences as they become available) — the common foundation across allied-health tracks.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join HOSA or a school BioClub",
      description: "HOSA and BioClub are the shared extracurricular pipeline across allied-health careers.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Continue AP science sequence",
      description: "Keep building AP-level science coursework.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Volunteer or shadow in a clinical setting",
      description: "Get direct clinical/healthcare exposure through volunteering or shadowing — the consistent theme across allied-health prep.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Research OT-specific summer programs and shadowing opportunities",
      description:
        "This is the point to do your own targeted research into OT-specific summer programs, since none are independently verified in this roadmap yet — ask a school counselor or a practicing OT for current recommendations.",
    },
  ],
};
