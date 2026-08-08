import type { CareerTrackTemplate } from "@/types/roadmap";

export const teachingK12: CareerTrackTemplate = {
  track: "teaching_k12",
  label: "K-12 Teaching",
  summary:
    "K-12 teachers educate students — a Bachelor's in Education or a subject area plus a teaching credential (4-5 years total). This track uses real, named programs (Future Teachers program) and leverages AP coursework in the subject you intend to teach.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP coursework in your intended teaching subject begins",
      description: "The source material specifically recommends AP coursework in the subject you intend to teach (e.g. AP History for a future social-studies teacher) — pick your subject focus now.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Psychology",
      description: "AP Psychology is named directly as relevant coursework for this track, regardless of subject specialty.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Join a tutoring program",
      description: "Tutoring programs are the named, real, direct entry point into teaching-adjacent experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "National Honor Society (lead peer tutoring)",
      description: "NHS's peer-tutoring leadership track is named directly as relevant experience.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Future Teachers program",
      description: "A real, named program specifically for high schoolers considering teaching.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "First Aid, CPR certification",
      description: "Named, real, standard credentials for anyone working with K-12 students.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Attend a summer teaching workshop",
      description: "Summer teaching workshops are named as real preparation heading into an Education degree program.",
    },
  ],
};
