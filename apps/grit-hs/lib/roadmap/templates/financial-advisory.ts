import type { CareerTrackTemplate } from "@/types/roadmap";

export const financialAdvisory: CareerTrackTemplate = {
  track: "financial_advisory",
  label: "Financial Advisory & Wealth Management",
  summary:
    "Financial advisors guide clients' investments and finances — a Bachelor's in Finance/Economics, often paired with CFA certification later. Distinct from the Financial Engineering track's quant/trading focus, this is the client-facing advisory side, anchored on DECA's investment simulations and Junior Achievement.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Personal financial literacy foundations",
      description: "Build a personal-finance foundation ahead of AP Calculus/Statistics and Economics.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Calculus/Statistics, Macroeconomics track begins",
      description: "Start toward AP Calculus or Statistics, plus Macroeconomics.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Junior Achievement finance programs",
      description: "Junior Achievement's finance programming is a real, named entry point for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "DECA investment simulations",
      description: "DECA's investment-simulation events build directly relevant applied skill.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Stock market games",
      description: "Classroom stock-market-game programs are a common, real, low-barrier entry point for this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Summer internship at a bank or brokerage",
      description: "A real internship at a bank or brokerage is the strongest application item for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "academics",
      title: "Continue Economics/Finance coursework toward a Finance or Economics major",
      description: "Finalize coursework heading into a Bachelor's in Finance or Economics, with CFA certification as a longer-term post-college goal.",
    },
  ],
};
