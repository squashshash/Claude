import type { CareerTrack } from "@/lib/constants";
import { CAREER_TRACK_LABELS } from "@/lib/constants";
import type { CareerTrackTemplate } from "@/types/roadmap";
import { preMedClinicalHealthcare } from "./pre-med-clinical-healthcare";
import { nursingAdvancedPractice } from "./nursing-advanced-practice";
import { softwareEngineering } from "./software-engineering";
import { financialEngineering } from "./financial-engineering";
import { mechanicalEngineeringCad } from "./mechanical-engineering-cad";
import { lawPublicPolicy } from "./law-public-policy";
import { dentistry } from "./dentistry";
import { pharmacy } from "./pharmacy";
import { physicianAssistant } from "./physician-assistant";
import { physicalTherapy } from "./physical-therapy";
import { occupationalTherapy } from "./occupational-therapy";
import { speechLanguagePathology } from "./speech-language-pathology";
import { dieteticsNutrition } from "./dietetics-nutrition";
import { radiologicTechnology } from "./radiologic-technology";
import { medicalLabTechnician } from "./medical-lab-technician";
import { publicHealth } from "./public-health";
import { veterinaryMedicine } from "./veterinary-medicine";
import { civilEngineering } from "./civil-engineering";
import { electricalComputerEngineering } from "./electrical-computer-engineering";
import { dataScience } from "./data-science";
import { cybersecurity } from "./cybersecurity";
import { accountingCpa } from "./accounting-cpa";
import { financialAdvisory } from "./financial-advisory";
import { marketingDigital } from "./marketing-digital";
import { entrepreneurship } from "./entrepreneurship";
import { humanResourcesManagement } from "./human-resources-management";
import { realEstate } from "./real-estate";
import { supplyChainManagement } from "./supply-chain-management";
import { judicialClerk } from "./judicial-clerk";
import { lawEnforcement } from "./law-enforcement";
import { fireEms } from "./fire-ems";
import { militaryOfficer } from "./military-officer";
import { intelligenceAnalysis } from "./intelligence-analysis";
import { socialWork } from "./social-work";
import { urbanPlanning } from "./urban-planning";
import { publicPolicyAdministration } from "./public-policy-administration";
import { graphicDesign } from "./graphic-design";
import { fashionDesign } from "./fashion-design";
import { architecture } from "./architecture";
import { filmMultimediaProduction } from "./film-multimedia-production";
import { photography } from "./photography";
import { animationGameArt } from "./animation-game-art";
import { musicComposition } from "./music-composition";
import { journalismWriting } from "./journalism-writing";
import { uxUiDesign } from "./ux-ui-design";
import { researchScience } from "./research-science";
import { environmentalScience } from "./environmental-science";
import { astrophysics } from "./astrophysics";
import { appliedStatistics } from "./applied-statistics";
import { teachingK12 } from "./teaching-k12";
import { higherEducationResearch } from "./higher-education-research";
import { schoolCounseling } from "./school-counseling";
import { specialEducation } from "./special-education";
import { aviationPilot } from "./aviation-pilot";
import { airTrafficControl } from "./air-traffic-control";
import { aircraftMaintenance } from "./aircraft-maintenance";
import { commercialDriving } from "./commercial-driving";
import { maritimeOperations } from "./maritime-operations";
import { electricalTrade } from "./electrical-trade";
import { plumbingTrade } from "./plumbing-trade";
import { hvacTrade } from "./hvac-trade";
import { constructionCarpentry } from "./construction-carpentry";
import { weldingMachining } from "./welding-machining";
import { automotiveTechnology } from "./automotive-technology";
import { masonryTrade } from "./masonry-trade";
import { heavyEquipmentOperation } from "./heavy-equipment-operation";
import { agribusinessManagement } from "./agribusiness-management";
import { agriculturalScience } from "./agricultural-science";
import { forestryParkManagement } from "./forestry-park-management";
import { wildlifeMarineBiology } from "./wildlife-marine-biology";
import { foodScience } from "./food-science";

// Partial, not a full Record<CareerTrack, ...> — every CAREER_TRACKS entry
// is a real, selectable pathway (see lib/constants.ts), but template content
// is authored incrementally. getRoadmapTemplate() below falls back to a
// clearly-labeled minimal template (no fabricated specifics) for any track
// whose full template hasn't landed yet, so the app never breaks or shows
// invented detail — see FALLBACK_NOTICE.
export const ROADMAP_TEMPLATES: Partial<Record<CareerTrack, CareerTrackTemplate>> = {
  pre_med_clinical_healthcare: preMedClinicalHealthcare,
  nursing_advanced_practice: nursingAdvancedPractice,
  software_engineering: softwareEngineering,
  financial_engineering: financialEngineering,
  mechanical_engineering_cad: mechanicalEngineeringCad,
  law_public_policy: lawPublicPolicy,
  dentistry,
  pharmacy,
  physician_assistant: physicianAssistant,
  physical_therapy: physicalTherapy,
  occupational_therapy: occupationalTherapy,
  speech_language_pathology: speechLanguagePathology,
  dietetics_nutrition: dieteticsNutrition,
  radiologic_technology: radiologicTechnology,
  medical_lab_technician: medicalLabTechnician,
  public_health: publicHealth,
  veterinary_medicine: veterinaryMedicine,
  civil_engineering: civilEngineering,
  electrical_computer_engineering: electricalComputerEngineering,
  data_science: dataScience,
  cybersecurity,
  accounting_cpa: accountingCpa,
  financial_advisory: financialAdvisory,
  marketing_digital: marketingDigital,
  entrepreneurship,
  human_resources_management: humanResourcesManagement,
  real_estate: realEstate,
  supply_chain_management: supplyChainManagement,
  judicial_clerk: judicialClerk,
  law_enforcement: lawEnforcement,
  fire_ems: fireEms,
  military_officer: militaryOfficer,
  intelligence_analysis: intelligenceAnalysis,
  social_work: socialWork,
  urban_planning: urbanPlanning,
  public_policy_administration: publicPolicyAdministration,
  graphic_design: graphicDesign,
  fashion_design: fashionDesign,
  architecture,
  film_multimedia_production: filmMultimediaProduction,
  photography,
  animation_game_art: animationGameArt,
  music_composition: musicComposition,
  journalism_writing: journalismWriting,
  ux_ui_design: uxUiDesign,
  research_science: researchScience,
  environmental_science: environmentalScience,
  astrophysics,
  applied_statistics: appliedStatistics,
  teaching_k12: teachingK12,
  higher_education_research: higherEducationResearch,
  school_counseling: schoolCounseling,
  special_education: specialEducation,
  aviation_pilot: aviationPilot,
  air_traffic_control: airTrafficControl,
  aircraft_maintenance: aircraftMaintenance,
  commercial_driving: commercialDriving,
  maritime_operations: maritimeOperations,
  electrical_trade: electricalTrade,
  plumbing_trade: plumbingTrade,
  hvac_trade: hvacTrade,
  construction_carpentry: constructionCarpentry,
  welding_machining: weldingMachining,
  automotive_technology: automotiveTechnology,
  masonry_trade: masonryTrade,
  heavy_equipment_operation: heavyEquipmentOperation,
  agribusiness_management: agribusinessManagement,
  agricultural_science: agriculturalScience,
  forestry_park_management: forestryParkManagement,
  wildlife_marine_biology: wildlifeMarineBiology,
  food_science: foodScience,
};

export const FALLBACK_NOTICE =
  "This pathway's detailed roadmap is still being researched and verified — check back soon for grade-by-grade milestones.";

function fallbackTemplate(track: CareerTrack): CareerTrackTemplate {
  return {
    track,
    label: CAREER_TRACK_LABELS[track],
    summary: FALLBACK_NOTICE,
    milestones: [],
  };
}

export function getRoadmapTemplate(track: CareerTrack): CareerTrackTemplate {
  return ROADMAP_TEMPLATES[track] ?? fallbackTemplate(track);
}
