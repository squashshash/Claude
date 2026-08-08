import { CAREER_TRACK_LABELS, type CareerTrack, type GradeLevel } from "@/lib/constants";

/**
 * Vivid "possible self" identity titles — Markus & Nurius's possible-selves
 * research (see the psych evidence doc, Section 6) argues a specific,
 * imagined future professional self motivates present action more than an
 * abstract category does. Hand-curated for commonly picked tracks; every
 * other track falls back to a generic-but-still-personal template rather
 * than being left out.
 */
const TRACK_NOUN: Partial<Record<CareerTrack, string>> = {
  pre_med_clinical_healthcare: "Doctor",
  nursing_advanced_practice: "Nurse",
  dentistry: "Dentist",
  pharmacy: "Pharmacist",
  physician_assistant: "PA",
  physical_therapy: "Physical Therapist",
  veterinary_medicine: "Veterinarian",
  software_engineering: "Software Engineer",
  mechanical_engineering_cad: "Mechanical Engineer",
  civil_engineering: "Civil Engineer",
  electrical_computer_engineering: "Electrical Engineer",
  data_science: "Data Scientist",
  cybersecurity: "Cybersecurity Analyst",
  financial_engineering: "Quant",
  accounting_cpa: "CPA",
  entrepreneurship: "Founder",
  law_public_policy: "Lawyer",
  law_enforcement: "Officer",
  fire_ems: "Firefighter",
  military_officer: "Officer",
  teaching_k12: "Teacher",
  aviation_pilot: "Pilot",
  architecture: "Architect",
  graphic_design: "Designer",
  animation_game_art: "Game Artist",
  research_science: "Scientist",
  astrophysics: "Astrophysicist",
  agribusiness_management: "Farmer",
  welding_machining: "Welder",
  electrical_trade: "Electrician",
};

const GRADE_PREFIX: Record<GradeLevel, string> = {
  summer_0: "Incoming",
  grade_9: "Freshman",
  grade_10: "Sophomore",
  grade_11: "Junior",
  grade_12: "Senior",
};

function shortLabel(track: CareerTrack): string {
  const label = CAREER_TRACK_LABELS[track];
  return label.split(/\s*[&(]/)[0].trim();
}

/** e.g. "Freshman Doctor-in-Training" or, for tracks without a curated noun, "Sophomore Aviation Track". */
export function identityTitle(track: CareerTrack, grade: GradeLevel): string {
  const prefix = GRADE_PREFIX[grade];
  const noun = TRACK_NOUN[track];
  if (noun) return `${prefix} ${noun}-in-Training`;
  return `${prefix} ${shortLabel(track)} Track`;
}
