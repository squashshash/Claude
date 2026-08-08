import type { CareerTrackTemplate } from "@/types/roadmap";

export const veterinaryMedicine: CareerTrackTemplate = {
  track: "veterinary_medicine",
  label: "Veterinary Medicine",
  summary:
    "Veterinarians treat animal health. Source material specifically names PreVet club and veterinary camps as real prep for this track, alongside the shared allied-health science coursework.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Rigorous science coursework begins",
      description: "Biology and Chemistry — the foundation both pre-med and pre-vet share.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a PreVet club or HOSA",
      description: "PreVet club is named directly in the source material as the track-specific extracurricular; HOSA also applies.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Continue AP sciences",
      description: "Keep AP Biology/Chemistry coursework rigorous through sophomore year.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer or work on a farm, shelter, or in a clinic",
      description: "Hands-on animal-care experience — farm, shelter, or veterinary clinic — is core prep for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Attend a veterinary camp",
      description: "Veterinary summer camps are named directly in the source material — research current, accredited options.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Shadow a practicing veterinarian",
      description: "Direct shadowing rounds out a strong pre-vet application record before entering an undergraduate pre-vet program.",
    },
  ],
};
