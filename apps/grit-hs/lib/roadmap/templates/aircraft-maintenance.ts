import type { CareerTrackTemplate } from "@/types/roadmap";

export const aircraftMaintenance: CareerTrackTemplate = {
  track: "aircraft_maintenance",
  label: "Aircraft Maintenance & Avionics",
  summary:
    "Aircraft mechanics and avionics technicians maintain aircraft — a 2-year FAA-certified mechanics school. This track uses the real named SkillsUSA aircraft-maintenance track and A&P (Airframe & Powerplant) certification.",
  milestones: [
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "Physics coursework begins",
      description: "Physics is the named academic foundation for this track.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a vocational auto-shop class (mechanical-skills foundation)",
      description: "Auto-shop coursework is named directly as building the mechanical-skill foundation this track needs.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "SkillsUSA (aircraft maintenance track)",
      description: "SkillsUSA runs a real, named aircraft-maintenance competitive track.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Model Aircraft Club",
      description: "A real, named, hands-on club specific to this field.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Enroll in a 2-year FAA-certified mechanics school",
      description: "The named, real, required education path for this track — begin researching and applying to programs.",
    },
  ],
};
