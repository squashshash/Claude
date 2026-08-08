export const CAREER_TRACKS = [
  // Medicine & Allied Health
  "pre_med_clinical_healthcare",
  "nursing_advanced_practice",
  "dentistry",
  "pharmacy",
  "physician_assistant",
  "physical_therapy",
  "occupational_therapy",
  "speech_language_pathology",
  "dietetics_nutrition",
  "radiologic_technology",
  "medical_lab_technician",
  "public_health",
  "veterinary_medicine",
  // Engineering & Technology
  "software_engineering",
  "mechanical_engineering_cad",
  "civil_engineering",
  "electrical_computer_engineering",
  "data_science",
  "cybersecurity",
  // Business & Finance
  "financial_engineering",
  "accounting_cpa",
  "financial_advisory",
  "marketing_digital",
  "entrepreneurship",
  "human_resources_management",
  "real_estate",
  "supply_chain_management",
  // Law, Government & Public Service
  "law_public_policy",
  "judicial_clerk",
  "law_enforcement",
  "fire_ems",
  "military_officer",
  "intelligence_analysis",
  "social_work",
  "urban_planning",
  "public_policy_administration",
  // Creative Arts & Design
  "graphic_design",
  "fashion_design",
  "architecture",
  "film_multimedia_production",
  "photography",
  "animation_game_art",
  "music_composition",
  "journalism_writing",
  "ux_ui_design",
  // Science & Research
  "research_science",
  "environmental_science",
  "astrophysics",
  "applied_statistics",
  // Education
  "teaching_k12",
  "higher_education_research",
  "school_counseling",
  "special_education",
  // Transportation & Logistics
  "aviation_pilot",
  "air_traffic_control",
  "aircraft_maintenance",
  "commercial_driving",
  "maritime_operations",
  // Trades & Vocational
  "electrical_trade",
  "plumbing_trade",
  "hvac_trade",
  "construction_carpentry",
  "welding_machining",
  "automotive_technology",
  "masonry_trade",
  "heavy_equipment_operation",
  // Agriculture & Environment
  "agribusiness_management",
  "agricultural_science",
  "forestry_park_management",
  "wildlife_marine_biology",
  "food_science",
] as const;

export type CareerTrack = (typeof CAREER_TRACKS)[number];

export const CAREER_TRACK_LABELS: Record<CareerTrack, string> = {
  pre_med_clinical_healthcare: "Pre-Medicine & Clinical Healthcare",
  nursing_advanced_practice: "Nursing & Advanced Practice",
  dentistry: "Dentistry (DDS/DMD)",
  pharmacy: "Pharmacy (PharmD)",
  physician_assistant: "Physician Assistant",
  physical_therapy: "Physical Therapy",
  occupational_therapy: "Occupational Therapy",
  speech_language_pathology: "Speech-Language Pathology",
  dietetics_nutrition: "Dietetics & Nutrition",
  radiologic_technology: "Radiologic Technology",
  medical_lab_technician: "Medical Lab Technician",
  public_health: "Public Health",
  veterinary_medicine: "Veterinary Medicine",
  software_engineering: "Software Engineering & Computational Systems",
  mechanical_engineering_cad: "Mechanical Engineering, CAD & Industrial Design",
  civil_engineering: "Civil Engineering",
  electrical_computer_engineering: "Electrical & Computer Engineering",
  data_science: "Data Science",
  cybersecurity: "Cybersecurity",
  financial_engineering: "Financial Engineering & Quantitative Finance",
  accounting_cpa: "Accounting (CPA)",
  financial_advisory: "Financial Advisory & Wealth Management",
  marketing_digital: "Marketing & Digital Media",
  entrepreneurship: "Entrepreneurship & Startups",
  human_resources_management: "Human Resources & Management",
  real_estate: "Real Estate",
  supply_chain_management: "Supply Chain Management",
  law_public_policy: "Jurisprudence, Constitutional Law & Public Policy",
  judicial_clerk: "Judicial Clerkship & the Judiciary",
  law_enforcement: "Law Enforcement",
  fire_ems: "Firefighting & EMS",
  military_officer: "Military Officer",
  intelligence_analysis: "Intelligence Analysis",
  social_work: "Social Work & Nonprofit Management",
  urban_planning: "Urban & City Planning",
  public_policy_administration: "Public Policy & Public Administration",
  graphic_design: "Graphic Design & Digital Art",
  fashion_design: "Fashion Design",
  architecture: "Architecture",
  film_multimedia_production: "Film & Multimedia Production",
  photography: "Photography",
  animation_game_art: "Animation & Game Art",
  music_composition: "Music & Composition",
  journalism_writing: "Journalism & Writing",
  ux_ui_design: "UX/UI Design",
  research_science: "Research Science (Biology, Chemistry, Physics)",
  environmental_science: "Environmental Science & Ecology",
  astrophysics: "Astronomy & Astrophysics",
  applied_statistics: "Applied Statistics",
  teaching_k12: "K-12 Teaching",
  higher_education_research: "Higher Education & Research Faculty",
  school_counseling: "School Counseling & Psychology",
  special_education: "Special Education",
  aviation_pilot: "Aviation (Airline Pilot)",
  air_traffic_control: "Air Traffic Control",
  aircraft_maintenance: "Aircraft Maintenance & Avionics",
  commercial_driving: "Commercial Driving (CDL)",
  maritime_operations: "Maritime Operations",
  electrical_trade: "Electrical Trade",
  plumbing_trade: "Plumbing Trade",
  hvac_trade: "HVAC Trade",
  construction_carpentry: "Construction & Carpentry",
  welding_machining: "Welding & Machining",
  automotive_technology: "Automotive Technology",
  masonry_trade: "Masonry & Heavy Equipment",
  heavy_equipment_operation: "Heavy Equipment Operation",
  agribusiness_management: "Agribusiness Management",
  agricultural_science: "Agricultural Science",
  forestry_park_management: "Forestry & Park Management",
  wildlife_marine_biology: "Wildlife & Marine Biology",
  food_science: "Food Science",
};

export const PATHWAY_CATEGORIES = [
  {
    slug: "medicine_allied_health",
    label: "Medicine & Allied Health",
    tracks: [
      "pre_med_clinical_healthcare",
      "nursing_advanced_practice",
      "dentistry",
      "pharmacy",
      "physician_assistant",
      "physical_therapy",
      "occupational_therapy",
      "speech_language_pathology",
      "dietetics_nutrition",
      "radiologic_technology",
      "medical_lab_technician",
      "public_health",
      "veterinary_medicine",
    ],
  },
  {
    slug: "engineering_technology",
    label: "Engineering & Technology",
    tracks: [
      "software_engineering",
      "mechanical_engineering_cad",
      "civil_engineering",
      "electrical_computer_engineering",
      "data_science",
      "cybersecurity",
    ],
  },
  {
    slug: "business_finance",
    label: "Business & Finance",
    tracks: [
      "financial_engineering",
      "accounting_cpa",
      "financial_advisory",
      "marketing_digital",
      "entrepreneurship",
      "human_resources_management",
      "real_estate",
      "supply_chain_management",
    ],
  },
  {
    slug: "law_government_public_service",
    label: "Law, Government & Public Service",
    tracks: [
      "law_public_policy",
      "judicial_clerk",
      "law_enforcement",
      "fire_ems",
      "military_officer",
      "intelligence_analysis",
      "social_work",
      "urban_planning",
      "public_policy_administration",
    ],
  },
  {
    slug: "creative_arts_design",
    label: "Creative Arts & Design",
    tracks: [
      "graphic_design",
      "fashion_design",
      "architecture",
      "film_multimedia_production",
      "photography",
      "animation_game_art",
      "music_composition",
      "journalism_writing",
      "ux_ui_design",
    ],
  },
  {
    slug: "science_research",
    label: "Science & Research",
    tracks: ["research_science", "environmental_science", "astrophysics", "applied_statistics"],
  },
  {
    slug: "education",
    label: "Education",
    tracks: ["teaching_k12", "higher_education_research", "school_counseling", "special_education"],
  },
  {
    slug: "transportation_logistics",
    label: "Transportation & Logistics",
    tracks: [
      "aviation_pilot",
      "air_traffic_control",
      "aircraft_maintenance",
      "commercial_driving",
      "maritime_operations",
    ],
  },
  {
    slug: "trades_vocational",
    label: "Trades & Vocational Careers",
    tracks: [
      "electrical_trade",
      "plumbing_trade",
      "hvac_trade",
      "construction_carpentry",
      "welding_machining",
      "automotive_technology",
      "masonry_trade",
      "heavy_equipment_operation",
    ],
  },
  {
    slug: "agriculture_environment",
    label: "Agriculture & Environment",
    tracks: [
      "agribusiness_management",
      "agricultural_science",
      "forestry_park_management",
      "wildlife_marine_biology",
      "food_science",
    ],
  },
] as const satisfies { slug: string; label: string; tracks: CareerTrack[] }[];

export type PathwayCategorySlug = (typeof PATHWAY_CATEGORIES)[number]["slug"];

export function getPathwayCategoryForTrack(track: CareerTrack) {
  return PATHWAY_CATEGORIES.find((c) => (c.tracks as readonly CareerTrack[]).includes(track));
}

export const GRADE_LEVELS = [
  "summer_0",
  "grade_9",
  "grade_10",
  "grade_11",
  "grade_12",
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];

export const GRADE_LEVEL_LABELS: Record<GradeLevel, string> = {
  summer_0: "Summer -0",
  grade_9: "Grade 9",
  grade_10: "Grade 10",
  grade_11: "Grade 11",
  grade_12: "Grade 12",
};

export const MILESTONE_CATEGORIES = [
  "academics",
  "certifications",
  "ctso",
  "experience",
] as const;

export type MilestoneCategory = (typeof MILESTONE_CATEGORIES)[number];

export const MILESTONE_CATEGORY_LABELS: Record<MilestoneCategory, string> = {
  academics: "Academics & Dual Enrollment",
  certifications: "Certifications & Legal Prerequisites",
  ctso: "Extracurriculars & CTSOs",
  experience: "Real-World Experience",
};

export const MILESTONE_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "locked",
] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

/** XP awarded when a milestone is marked completed, and revoked if un-marked. */
export const MILESTONE_XP_AWARD = 100;

/**
 * XP for the right-panel Life Panel activities — clubs, sports, leadership
 * roles, and exam scores. Smaller than MILESTONE_XP_AWARD since these are
 * lower-effort, more-frequent actions than a roadmap milestone. Every award
 * here is revoked (or recomputed) if the underlying record is deleted or
 * edited, via lib/gamification/xp.ts, so it can't be farmed by repeatedly
 * adding and deleting the same entry.
 */
export const CLUB_XP_AWARD = 15;
export const SPORT_XP_AWARD = 15;
/** Bonus on top of the base club/sport XP for a real leadership role. */
export const LEADERSHIP_XP_BONUS = 25;
/** Awarded once a real score is logged for an exam — never fabricated. */
export const EXAM_GOOD_SCORE_XP = 30;
export const EXAM_OK_SCORE_XP = 15;
export const EXAM_GOOD_SCORE_THRESHOLD = 90;
export const EXAM_OK_SCORE_THRESHOLD = 75;

/**
 * Common leadership-role keywords, matched case-insensitively against the
 * free-text `role` field a student types for a club/sport. Real signal from
 * what they actually entered, not a guess at their actual title.
 */
const LEADERSHIP_KEYWORDS = [
  "president",
  "vice president",
  "captain",
  "co-captain",
  "officer",
  "leader",
  "chair",
  "treasurer",
  "secretary",
  "founder",
  "coordinator",
  "head",
];

export function isLeadershipRole(role: string | null | undefined): boolean {
  if (!role) return false;
  const lower = role.toLowerCase();
  return LEADERSHIP_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/** XP for an exam's logged score — 0 if no score yet or below the OK threshold. */
export function xpForExamScore(score: number | null | undefined): number {
  if (score === null || score === undefined) return 0;
  if (score >= EXAM_GOOD_SCORE_THRESHOLD) return EXAM_GOOD_SCORE_XP;
  if (score >= EXAM_OK_SCORE_THRESHOLD) return EXAM_OK_SCORE_XP;
  return 0;
}
