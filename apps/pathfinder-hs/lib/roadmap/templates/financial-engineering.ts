import type { CareerTrackTemplate } from "@/types/roadmap";

export const financialEngineering: CareerTrackTemplate = {
  track: "financial_engineering",
  label: "Financial Engineering & Quantitative Finance",
  summary:
    "The FINRA SIE exam has a strict 18-year-old floor with no exceptions, so this track deliberately front-loads modeling and DECA/FBLA work and schedules the SIE for the exact week the student turns 18.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Intro to Microeconomics",
      description: "Microeconomics fundamentals, personal financial literacy.",
    },
    {
      gradeLevel: "summer_0",
      category: "certifications",
      title: "Excel Skills for Business Essentials",
      description: "Coursera/Macquarie Excel fundamentals certificate.",
    },
    {
      gradeLevel: "summer_0",
      category: "ctso",
      title: "Simulated Trading Games",
      description: "DECA/FBLA orientation via simulated trading competitions.",
    },
    {
      gradeLevel: "summer_0",
      category: "experience",
      title: "Excel Mastery + StockTrak Simulations",
      description: "Microsoft Excel keyboard shortcut mastery; StockTrak trading portfolio simulations.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Microeconomics, AP Human Geography, Honors Algebra II",
      description: "Freshman-year coursework.",
    },
    {
      gradeLevel: "grade_9",
      category: "certifications",
      title: "Microsoft Office Specialist (MOS): Excel Associate",
      description: "Entry-level Excel credential.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "DECA Event: Financial Consulting",
      description: "Freshman-year DECA competitive event.",
    },
    {
      gradeLevel: "grade_9",
      category: "experience",
      title: "Monthly Fed Policy & Market Reports",
      description: "Publish monthly economic analysis reports on Federal Reserve rate policies.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Macroeconomics, AP Statistics, Honors Pre-Calculus",
      description: "Sophomore-year coursework.",
    },
    {
      gradeLevel: "grade_10",
      category: "certifications",
      title: "Bloomberg Market Concepts (BMC); MOS Excel Expert",
      description: "Self-paced financial markets primer plus advanced Excel credential.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Wharton Global High School Investment Competition",
      description: "Sophomore-year investment competition.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "3-Statement SEC 10-K Financial Models",
      description: "Construct 3-statement financial models from SEC Form 10-K filings.",
    },
    {
      gradeLevel: "grade_11",
      category: "academics",
      title: "DE Financial Accounting, AP Calculus BC, AP US History",
      description: "Junior-year coursework.",
    },
    {
      gradeLevel: "grade_11",
      category: "certifications",
      title: "Wall Street Prep / CFI FMVA (Student Track)",
      description: "Financial modeling and valuation certification track, preparing for the FINRA SIE exam window.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "National Economics Challenge + FBLA Securities & Investments",
      description: "Adam Smith Division of the National Economics Challenge, plus FBLA competitive events.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Independent Equity Valuation Deck (DCF)",
      description: "Conduct an independent equity research valuation deck (DCF/Comps).",
    },
    {
      gradeLevel: "grade_12",
      category: "academics",
      title: "DE Managerial Accounting, Multivariable Calculus, Microeconomic Theory",
      description: "Senior-year coursework.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "FINRA SIE Exam — File Form U10 on 18th Birthday",
      description:
        "Strict 18-year-old floor, no exceptions. Schedule the exam for the student's 18th birthday window so the 4-year validity covers undergraduate studies.",
      agePrerequisite: 18,
      certRef: "FINRA Securities Industry Essentials (SIE) Exam",
    },
    {
      gradeLevel: "grade_12",
      category: "ctso",
      title: "DECA National Finalist",
      description: "Capstone DECA competitive placement.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Investment Committee Presentation",
      description:
        "Present the equity research deck to a local investment advisory panel; enter university with a verified FINRA SIE pass result.",
    },
  ],
};
