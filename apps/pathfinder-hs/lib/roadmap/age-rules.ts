/**
 * Mirrors the `certifications` seed data (supabase/migrations/0002_*.sql) for
 * client-side age-gate rendering. Phase 3 replaces this with a live query;
 * kept here so Phase 2 components have real data instead of placeholders.
 */
export interface AgeRule {
  minAge: number;
  notes?: string;
}

export interface CertificationAgeRules {
  title: string;
  defaultRule: AgeRule;
  stateOverrides?: Record<string, AgeRule>;
}

export const CERTIFICATION_AGE_RULES: CertificationAgeRules[] = [
  {
    title: "NHA Certified Clinical Medical Assistant (CCMA)",
    defaultRule: {
      minAge: 0,
      notes: "Provisional exam allowed up to 12 months pre-graduation; converts to full certification on proof of diploma.",
    },
  },
  {
    title: "NREMT EMT-Basic",
    defaultRule: {
      minAge: 16,
      notes: "Cognitive exam has no legal floor, but training programs typically require 16+; active state license usually requires 18.",
    },
  },
  {
    title: "Certified Nursing Assistant (CNA)",
    defaultRule: { minAge: 16 },
    stateOverrides: {
      CA: { minAge: 18, notes: "California enforces an 18-year-old floor for clinical facility placement." },
      FL: { minAge: 16 },
      TX: { minAge: 16 },
    },
  },
  {
    title: "FINRA Securities Industry Essentials (SIE) Exam",
    defaultRule: { minAge: 18, notes: "Strict floor, no exceptions." },
  },
  {
    title: "Certified SOLIDWORKS Associate (CSWA)",
    defaultRule: { minAge: 0, notes: "Age-neutral; direct purchase requires 18+ to accept the EULA — use a school Academic Provider voucher instead." },
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
