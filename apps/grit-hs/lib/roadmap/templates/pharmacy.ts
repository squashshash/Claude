import type { CareerTrackTemplate } from "@/types/roadmap";

export const pharmacy: CareerTrackTemplate = {
  track: "pharmacy",
  label: "Pharmacy (PharmD)",
  summary:
    "Pharmacists dispense medications and counsel patients — a PharmD is 6-8 years post-high-school. This track pairs AP Chemistry/Biology/Math with Science Olympiad's chem-lab events and a real Pharmacy Technician certification pursued senior year.",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Algebra & general Chemistry foundations",
      description: "Build the math and chemistry base the AP sequence below depends on.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Chemistry pathway begins",
      description: "Start the AP Chemistry sequence as early as your school allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Science Olympiad — chem lab events",
      description: "Join Science Olympiad and compete in chemistry-lab-focused events.",
    },
    {
      gradeLevel: "grade_10",
      category: "academics",
      title: "AP Biology, advanced Math",
      description: "Add AP Biology and continue the math sequence toward Calculus.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Health Occupations Students of America (HOSA)",
      description: "Join HOSA for pharmacy/health-occupations-track events and networking.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Volunteer or work in a pharmacy or medical office",
      description: "Start volunteering at a local pharmacy or medical office to see the work firsthand.",
    },
    {
      gradeLevel: "grade_11",
      category: "ctso",
      title: "Future Business Leaders of America (for pharmacy business side)",
      description: "FBLA exposes the business/operations side of running a pharmacy.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "NIH pharmacy internship or university summer chem program",
      description: "Apply to an NIH-affiliated pharmacy internship or a university summer chemistry program.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "Pharmacy Technician certification",
      description: "Complete a Pharmacy Technician certification during senior year — real, industry-recognized credential ahead of a PharmD track.",
    },
    {
      gradeLevel: "grade_12",
      category: "experience",
      title: "Chemistry lab kit / formulate herbal remedies project (under guidance)",
      description: "Build a hands-on chemistry project — e.g. a lab kit build or a guided herbal-remedy formulation exercise — for your application portfolio.",
    },
  ],
};
