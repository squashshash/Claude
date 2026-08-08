import type { CareerTrackTemplate } from "@/types/roadmap";

export const fireEms: CareerTrackTemplate = {
  track: "fire_ems",
  label: "Firefighting & EMS",
  summary:
    "Firefighters and EMTs/paramedics respond to emergencies — fire academy is post-high-school, with EMT/Paramedic certification. This track uses the real volunteer fire/EMS squad pipeline (many programs accept 16+) and Scouts' emergency merit badges.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "experience",
      title: "Join Boy/Girl Scouts and pursue emergency/rescue merit badges",
      description: "Scouts' emergency and rescue merit badges are named directly as real, concrete preparation for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Swim team or another fitness-and-endurance activity",
      description: "Fitness and endurance are explicitly named as important for this physically demanding track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Volunteer for a local volunteer fire/EMS squad",
      description: "Many volunteer fire/EMS programs accept students starting at 16 — a real, direct entry point named in the source material.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "CPR certification",
      description: "CPR certification is a real, standard, obtainable-in-high-school credential for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Wilderness First Aid certification",
      description: "Wilderness First Aid is a real, named certification that strengthens an EMT/firefighter application.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Complete an EMT-Basic course, if age-eligible in your state",
      description: "EMT-Basic certification requirements vary by state — check your state's minimum age before enrolling; this is the natural next step after volunteer squad experience.",
    },
  ],
};
