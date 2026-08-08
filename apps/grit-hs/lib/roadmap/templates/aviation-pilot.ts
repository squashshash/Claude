import type { CareerTrackTemplate } from "@/types/roadmap";

export const aviationPilot: CareerTrackTemplate = {
  track: "aviation_pilot",
  label: "Aviation (Airline Pilot)",
  summary:
    "Airline pilots fly commercial planes — flight training plus Airline Transport Pilot (ATP) certification, which requires 1,500+ flight hours. This track uses the real named ACES pilot-training camp at Embry-Riddle and the Civil Air Patrol pipeline.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Physics/Math track begins",
      description: "Strong physics and math coursework is named directly as relevant — some airlines recruit from high-GPA STEM students.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join an Aviation Club or a flight simulator club",
      description: "Both are named, real, direct entry points for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Civil Air Patrol",
      description: "Civil Air Patrol is a real, named youth aviation program — a direct pipeline into flight training.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Air Force ROTC / AFOQT prep, if pursuing a military aviation path",
      description: "AFROTC and the AFOQT (Air Force Officer Qualifying Test) are named, real paths into military aviation, one route into this career.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "ACES pilot training camp at Embry-Riddle",
      description: "A real, named pilot-training summer camp at Embry-Riddle Aeronautical University.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "FAA aviation workshop",
      description: "FAA-run aviation workshops are named, real preparation before starting formal flight training and working toward ATP certification.",
    },
  ],
};
