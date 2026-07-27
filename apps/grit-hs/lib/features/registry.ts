export type FeatureStatus = "live" | "mock" | "planned";

export interface FeatureDef {
  slug: string;
  number: number;
  title: string;
  blurb: string;
  status: FeatureStatus;
}

export interface FeatureCategory {
  slug: string;
  title: string;
  features: FeatureDef[];
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    slug: "academics",
    title: "High-Yield Academics & Advanced Placement",
    features: [
      {
        slug: "gpa-calculator",
        number: 1,
        title: "Target GPA & Grade-Aiming Calculator",
        blurb: "Tell it your target grade — it tells you exactly what you need on what's left.",
        status: "live",
      },
      {
        slug: "ap-ib-optimizer",
        number: 2,
        title: "AP / IB Course Optimizer",
        blurb: "The exact AP/IB/DE sequence for your track, year by year.",
        status: "live",
      },
      {
        slug: "dual-enrollment-predictor",
        number: 3,
        title: "Dual-Enrollment & Transferability Predictor",
        blurb: "Which community-college courses actually transfer into your target major.",
        status: "planned",
      },
      {
        slug: "four-year-planner",
        number: 4,
        title: "Specialized High School 4-Year Planner",
        blurb: "A balanced 9th-12th schedule mixing graduation requirements with career electives.",
        status: "live",
      },
    ],
  },
  {
    slug: "ctech",
    title: "Specialized Technical & Early College Hubs (CTECH / P-TECH)",
    features: [
      {
        slug: "ctech-integration",
        number: 5,
        title: "CTECH Program Integration",
        blurb: "Local Career & Technical Education courses mapped into your schedule.",
        status: "planned",
      },
      {
        slug: "p-tech-tracker",
        number: 6,
        title: "P-TECH Associate Degree Tracker",
        blurb: "Track your tuition-free 6-year Associate Degree progress.",
        status: "planned",
      },
      {
        slug: "cte-articulation-vault",
        number: 7,
        title: "CTE Articulation Credit Vault",
        blurb: "CTE courses that grant automatic articulated college credit.",
        status: "planned",
      },
    ],
  },
  {
    slug: "college",
    title: "College Targeting & Major Alignment",
    features: [
      {
        slug: "college-matcher",
        number: 8,
        title: "Career-to-College Target Matcher",
        blurb: "Top-tier and direct-admit programs for your career, with real benchmarks.",
        status: "planned",
      },
      {
        slug: "direct-admit-planner",
        number: 9,
        title: "Direct-Admit & BS/MD Pathway Planner",
        blurb: "The exact prerequisites specialized direct-admit programs check for.",
        status: "planned",
      },
      {
        slug: "essay-deconstructor",
        number: 10,
        title: "University Essay Prompt Deconstructor",
        blurb: "Turns supplemental prompts into outlines built from your logged wins.",
        status: "planned",
      },
    ],
  },
  {
    slug: "legal",
    title: "State Rules, Legal & Compliance Engine",
    features: [
      {
        slug: "certification-rulebook",
        number: 11,
        title: "State-by-State Certification Rulebook",
        blurb: "Real age-eligibility rules for every credential in the catalog, by state.",
        status: "live",
      },
      {
        slug: "youth-labor-laws",
        number: 12,
        title: "Youth Minor Working Laws & Permit Guide",
        blurb: "State child-labor rules, max hours, and required permit sign-offs.",
        status: "planned",
      },
      {
        slug: "liability-hub",
        number: 13,
        title: "Shadowing & Clinical Liability Hub",
        blurb: "HIPAA agreements, liability waivers, background-check protocols.",
        status: "planned",
      },
    ],
  },
  {
    slug: "jobs",
    title: "Jobs, Paid Work & Financial Independence",
    features: [
      {
        slug: "job-board",
        number: 14,
        title: "Entry-Level Youth Job & Internship Board",
        blurb: "Paid, age-appropriate roles — Pharmacy Tech, Junior Developer, Lab Assistant.",
        status: "mock",
      },
      {
        slug: "grant-finder",
        number: 15,
        title: "Stipend & Micro-Grant Finder",
        blurb: "$250-$1,000 grants for exam fees, scrubs, or competition travel.",
        status: "mock",
      },
      {
        slug: "tax-guide",
        number: 16,
        title: "W-4 & Youth Tax Essentials Guide",
        blurb: "Withholdings, direct deposit, and budgeting your first paycheck.",
        status: "planned",
      },
    ],
  },
  {
    slug: "transportation",
    title: "Transportation & License Milestones",
    features: [
      {
        slug: "license-tracker",
        number: 17,
        title: "Driver's License & Mobility Progress Tracker",
        blurb: "Permit hours, driver's ed, and your target road-test date.",
        status: "live",
      },
      {
        slug: "transit-planner",
        number: 18,
        title: "Transit & Commute Route Planner",
        blurb: "Routes and travel times to clinicals, CTECH centers, and work.",
        status: "planned",
      },
    ],
  },
  {
    slug: "experience",
    title: "Real-World Experience & Extracurriculars",
    features: [
      {
        slug: "ctso-strategy-engine",
        number: 19,
        title: "CTSO Competition Strategy Engine",
        blurb: "Every HOSA/DECA/TSA event across all 6 tracks, plus a speech timer.",
        status: "live",
      },
      {
        slug: "cold-outreach",
        number: 20,
        title: "Cold Outreach Generator",
        blurb: "Mail-merges a real outreach template from your details in seconds.",
        status: "mock",
      },
      {
        slug: "hours-logger",
        number: 21,
        title: "Clinical & Volunteer Hours Verification Logger",
        blurb: "Log hours and capture a supervisor signature right on screen.",
        status: "live",
      },
      {
        slug: "summer-programs",
        number: 22,
        title: "High-Yield Summer Program Directory",
        blurb: "Funded, prestigious research programs filtered by grade level.",
        status: "mock",
      },
    ],
  },
  {
    slug: "portfolio",
    title: "Digital Portfolio & Resume Tools",
    features: [
      {
        slug: "resume-builder",
        number: 23,
        title: "Dynamic \"Grit\" Resume Builder",
        blurb: "Your completed milestones and certs, auto-assembled into a resume.",
        status: "live",
      },
      {
        slug: "public-handle",
        number: 24,
        title: "Public Student Portfolio Handle",
        blurb: "A shareable grit.hs/you page for admissions officers and recruiters.",
        status: "planned",
      },
      {
        slug: "credential-vault",
        number: 25,
        title: "Digital Credential Vault",
        blurb: "Upload and organize certificates, licenses, and transcripts.",
        status: "live",
      },
    ],
  },
  {
    slug: "execution",
    title: "Execution, Mentorship & Accountability",
    features: [
      {
        slug: "weekly-tasks",
        number: 26,
        title: "Weekly Task Deconstructor",
        blurb: "Your goals, broken into 15-minute tasks you can actually finish this week.",
        status: "live",
      },
      {
        slug: "streak-score",
        number: 27,
        title: "\"Streak & Grit\" Gamified Score System",
        blurb: "Streaks and unlockable badges for showing up and following through.",
        status: "live",
      },
      {
        slug: "mentor-matcher",
        number: 28,
        title: "Near-Peer Mentor Matcher",
        blurb: "Undergrads and young pros who've already run your exact playbook.",
        status: "mock",
      },
      {
        slug: "counselor-export",
        number: 29,
        title: "Counselor & Advisor Export Hub",
        blurb: "A 1-page summary of your credentials and hours for endorsement.",
        status: "planned",
      },
      {
        slug: "parent-dashboard",
        number: 30,
        title: "Parent Read-Only Dashboard",
        blurb: "Safety, logistics, and deadlines — visible, never editable.",
        status: "planned",
      },
    ],
  },
];

export const ALL_FEATURES: FeatureDef[] = FEATURE_CATEGORIES.flatMap((c) => c.features);

export function getFeature(slug: string): FeatureDef | undefined {
  return ALL_FEATURES.find((f) => f.slug === slug);
}

export function getFeatureCategory(slug: string): FeatureCategory | undefined {
  return FEATURE_CATEGORIES.find((c) => c.features.some((f) => f.slug === slug));
}
