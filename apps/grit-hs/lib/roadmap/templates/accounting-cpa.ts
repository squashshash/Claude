import type { CareerTrackTemplate } from "@/types/roadmap";

export const accountingCpa: CareerTrackTemplate = {
  track: "accounting_cpa",
  label: "Accounting (CPA)",
  summary:
    "Accountants manage financial records and taxes — a Bachelor's in Accounting plus CPA licensure (often 150 hours of education). This track uses FBLA's real accounting events and a genuine internship-then-mock-portfolio sequence.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Algebra II foundations",
      description: "Build the math base ahead of AP Calculus and Economics.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Calculus, Economics track begins",
      description: "Start toward AP Calculus and Economics as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join a Math Club or Investment/Finance club",
      description: "Both are named, real entry points for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "Accounting coursework, if offered",
      description: "Take an Accounting elective if your school offers one.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "FBLA accounting events",
      description: "Future Business Leaders of America runs named accounting-specific competitive events.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "DECA finance events, Debate",
      description: "DECA's finance-track events plus Debate build the communication side accounting/audit work needs.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "Summer internship at a local accounting firm or tax preparer",
      description: "A real internship at a local firm is the single strongest application item for this track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Manage a mock portfolio; run a 'stock market challenge'",
      description: "A mock-portfolio project or a school stock-market-challenge event demonstrates applied finance skill.",
    },
    {
      gradeLevel: "grade_12",
      category: "ctso",
      title: "AICPA student chapter involvement",
      description: "AICPA (American Institute of CPAs) runs student chapters worth joining as a capstone credential.",
    },
  ],
};
