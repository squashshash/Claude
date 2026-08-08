import type { CareerTrackTemplate } from "@/types/roadmap";

export const lawEnforcement: CareerTrackTemplate = {
  track: "law_enforcement",
  label: "Law Enforcement",
  summary:
    "Police officers and detectives enforce law and solve crime — a high school diploma plus police academy, though many agencies now prefer some college (A.A./B.A. in Criminal Justice). This track uses the real Civil Air Patrol / Scouts leadership pipeline and physical-fitness prep.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Civics coursework begins",
      description: "Civics classes are named directly as core preparation for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join JROTC or Civil Air Patrol",
      description: "JROTC and Civil Air Patrol are both real, named leadership/discipline pipelines for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Team sports or Olympic lifting for physical fitness",
      description: "Physical fitness testing is a real part of police-academy admission — team sports or structured strength training (Olympic lifting) both prepare for it.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Boy/Girl Scouts (leadership focus)",
      description: "Scouts' leadership-badge track is named as directly relevant preparation.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "First aid certification",
      description: "First-aid certification is named as a real, concrete credential for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Local law enforcement explorer program",
      description: "Many departments run named youth 'explorer' programs — a real, direct entry point.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Ride-along program or volunteer at community-policing events",
      description: "Ride-alongs and community-policing volunteer work are the strongest direct-exposure evidence for this track before applying to a police academy or a Criminal Justice program.",
    },
  ],
};
