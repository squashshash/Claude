import type { CareerTrackTemplate } from "@/types/roadmap";

export const schoolCounseling: CareerTrackTemplate = {
  track: "school_counseling",
  label: "School Counseling & Psychology",
  summary:
    "School counselors and psychologists guide students' academic and social development — a Master's in Counseling or Education. This track uses real, named preparation (Psychology coursework, volunteer tutoring/mentoring, crisis-response training).",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Psychology coursework begins",
      description: "Psychology courses are the named, direct foundation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer tutoring or mentoring younger students",
      description: "Named directly as core preparation for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "CPR certification (for school safety)",
      description: "Named directly as a real, relevant credential — school counselors are often part of a building's safety response team.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "Crisis response training",
      description: "Named directly as relevant, real training for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Continue mentoring/tutoring in a leadership role",
      description: "Building on earlier mentoring experience with more responsibility is the strongest evidence of readiness for this track heading into a Counseling or Education degree.",
    },
  ],
};
