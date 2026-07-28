import type { CareerTrack } from "@/lib/constants";
import type { CareerTrackTemplate } from "@/types/roadmap";
import { preMedClinicalHealthcare } from "./pre-med-clinical-healthcare";
import { nursingAdvancedPractice } from "./nursing-advanced-practice";
import { softwareEngineering } from "./software-engineering";
import { financialEngineering } from "./financial-engineering";
import { mechanicalEngineeringCad } from "./mechanical-engineering-cad";
import { lawPublicPolicy } from "./law-public-policy";

export const ROADMAP_TEMPLATES: Record<CareerTrack, CareerTrackTemplate> = {
  pre_med_clinical_healthcare: preMedClinicalHealthcare,
  nursing_advanced_practice: nursingAdvancedPractice,
  software_engineering: softwareEngineering,
  financial_engineering: financialEngineering,
  mechanical_engineering_cad: mechanicalEngineeringCad,
  law_public_policy: lawPublicPolicy,
};

export function getRoadmapTemplate(track: CareerTrack): CareerTrackTemplate {
  return ROADMAP_TEMPLATES[track];
}
