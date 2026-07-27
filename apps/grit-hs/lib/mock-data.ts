/**
 * Placeholder data for the Phase 2 UI demo. Phase 3 replaces this with real
 * Supabase reads (profiles, roadmaps, milestones) behind the auth session.
 */
import type { CareerTrack } from "@/lib/constants";

export const MOCK_STUDENT = {
  fullName: "Jordan Alvarez",
  age: 15,
  xpPoints: 6250,
  state: "TX",
  currentGrade: "grade_10" as const,
  targetCareer: "pre_med_clinical_healthcare" as CareerTrack,
};
