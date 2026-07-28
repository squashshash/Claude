/**
 * Mirrors the `certifications` seed data (supabase/migrations/0002_*.sql) for
 * client-side rendering (age-gate badges, the State Certification Rulebook).
 * Phase 3 replaces this with a live query; kept here so Phase 2 components
 * have real data instead of placeholders.
 */
export interface AgeRule {
  minAge: number;
  notes?: string;
}

export interface CertificationAgeRules {
  title: string;
  category: string;
  description: string;
  defaultRule: AgeRule;
  stateOverrides?: Record<string, AgeRule>;
}

export const CERTIFICATION_AGE_RULES: CertificationAgeRules[] = [
  {
    title: "NHA Certified Clinical Medical Assistant (CCMA)",
    category: "healthcare",
    description:
      "180 multiple-choice questions, 3 hours, scaled passing score 390+. Provisional status expires 12 months after the exam date unless proof of graduation is uploaded, converting it to a full 2-year certification.",
    defaultRule: {
      minAge: 0,
      notes: "Provisional exam allowed up to 12 months pre-graduation; converts to full certification on proof of diploma.",
    },
  },
  {
    title: "NHA Certified Phlebotomy Technician (CPT)",
    category: "healthcare",
    description: "Requires 30 successful venipunctures and 10 capillary sticks. Same provisional mechanics as the CCMA.",
    defaultRule: { minAge: 0, notes: "Provisional mechanics identical to CCMA." },
  },
  {
    title: "NREMT EMT-Basic",
    category: "healthcare",
    description: "National registry validity is 2 years after passing the cognitive exam.",
    defaultRule: {
      minAge: 16,
      notes: "Cognitive exam has no legal floor, but training programs typically require 16+; active state license usually requires 18.",
    },
  },
  {
    title: "Certified Nursing Assistant (CNA)",
    category: "healthcare",
    description: "Governed state-by-state under federal OBRA guidelines.",
    defaultRule: { minAge: 16 },
    stateOverrides: {
      CA: { minAge: 18, notes: "California enforces an 18-year-old floor for clinical facility placement." },
      FL: { minAge: 16 },
      TX: { minAge: 16 },
    },
  },
  {
    title: "FINRA Securities Industry Essentials (SIE) Exam",
    category: "finance",
    description:
      "80 multiple-choice questions (75 scored), 1 hour 45 minutes, 70% passing score. Valid 4 years from pass date.",
    defaultRule: {
      minAge: 18,
      notes: "Strict floor, no exceptions. Schedule for the student's 18th birthday window so the 4-year validity covers undergraduate studies.",
    },
  },
  {
    title: "Certified SOLIDWORKS Associate (CSWA)",
    category: "engineering",
    description: "~150 classroom hours recommended: engineering fundamentals, part modeling, assembly building, drawing analysis. Does not expire.",
    defaultRule: {
      minAge: 0,
      notes: "Age-neutral; direct purchase requires 18+ to accept the EULA — use a school Academic Provider voucher instead.",
    },
  },
  {
    title: "Certified SOLIDWORKS Professional (CSWP)",
    category: "engineering",
    description: "Advanced-tier credential requiring 1-2 years of modeling experience beyond the CSWA.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "CompTIA Security+",
    category: "technology",
    description: "Administered via Pearson VUE. Valid 3 years, renewable via Continuing Education.",
    defaultRule: { minAge: 0, notes: "No age limit; parental consent required only under 13." },
  },
  {
    title: "Autodesk Certified User: AutoCAD",
    category: "engineering",
    description: "~150 hours hands-on Autodesk software experience. Valid 3 years.",
    defaultRule: { minAge: 0, notes: "No age limit; parental consent required only under 13." },
  },
  {
    title: "AHA CPR / AED / First Aid for Healthcare Providers",
    category: "healthcare",
    description: "Common Summer -0 starting credential across all healthcare-adjacent tracks.",
    defaultRule: { minAge: 12, notes: "Age floor is a course-provider convention, not a legal requirement." },
  },
  {
    title: "HIPAA Compliance & OSHA Bloodborne Pathogens Certification",
    category: "healthcare",
    description: "Online compliance training required before clinical shadowing or externship placements.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "OpenEDG Python Institute PCEP",
    category: "technology",
    description: "Entry-level Python certification with no prerequisites.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "OpenEDG Python Institute PCAP",
    category: "technology",
    description: "Associate-level Python certification, typical 9th-grade follow-on to the PCEP.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "AWS Certified Cloud Practitioner",
    category: "technology",
    description: "Foundational AWS credential with no prerequisites, valid 3 years.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "AWS Certified Solutions Architect – Associate",
    category: "technology",
    description: "Associate-level architecture credential, valid 3 years.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "AWS Certified Developer – Associate",
    category: "technology",
    description: "Associate-level developer credential, valid 3 years.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "Microsoft Office Specialist (MOS): Excel Associate",
    category: "finance",
    description: "Entry-level Excel credential commonly paired with DECA/FBLA finance-track coursework.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "Bloomberg Market Concepts (BMC)",
    category: "finance",
    description: "Self-paced financial markets primer used to prepare finance-track students ahead of the FINRA SIE.",
    defaultRule: { minAge: 0 },
  },
  {
    title: "Wall Street Prep Corporate Finance / CFI FMVA (Student Track)",
    category: "finance",
    description: "Financial modeling and valuation certification track used as pre-18 preparation ahead of the FINRA SIE exam window.",
    defaultRule: { minAge: 0 },
  },
];

export function getAgeRule(certRef: string, state?: string): AgeRule | undefined {
  const cert = CERTIFICATION_AGE_RULES.find((c) => c.title === certRef);
  if (!cert) return undefined;
  if (state && cert.stateOverrides?.[state]) return cert.stateOverrides[state];
  return cert.defaultRule;
}

export function isTooYoung(certRef: string, studentAge: number, state?: string): boolean {
  const rule = getAgeRule(certRef, state);
  if (!rule) return false;
  return studentAge < rule.minAge;
}
