import type { CareerTrackTemplate } from "@/types/roadmap";

export const cybersecurity: CareerTrackTemplate = {
  track: "cybersecurity",
  label: "Cybersecurity",
  summary:
    "Cybersecurity analysts protect networks and systems — B.S. in Cybersecurity or Computer Science. This track uses the real Capture-the-Flag competitive circuit, CyberPatriot, and named government-run summer programs (NSA GenCyber, DoD Cyber internships).",
  milestones: [
    {
      gradeLevel: "summer_0",
      category: "academics",
      title: "Intro coding and networking basics",
      description: "Build the foundation the AP Computer Science sequence depends on.",
    },
    {
      gradeLevel: "grade_9",
      category: "academics",
      title: "AP Computer Science track begins",
      description: "Start toward AP Computer Science as your school's sequence allows.",
    },
    {
      gradeLevel: "grade_9",
      category: "ctso",
      title: "Join CyberPatriot",
      description: "CyberPatriot is the real, named national youth cyber-defense competition — the core extracurricular for this track.",
    },
    {
      gradeLevel: "grade_10",
      category: "experience",
      title: "Install and administer servers at home",
      description: "Hands-on server administration builds directly relevant, verifiable skill for a cybersecurity application.",
    },
    {
      gradeLevel: "grade_10",
      category: "ctso",
      title: "Capture-the-Flag (CTF) competitions",
      description: "CTF competitions are the real, named competitive circuit specific to this track.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "NSA GenCyber camp",
      description: "NSA's GenCyber camp is a real, named, government-run summer cybersecurity program.",
    },
    {
      gradeLevel: "grade_11",
      category: "experience",
      title: "DoD Cyber internship",
      description: "Department of Defense Cyber internships are a real, named opportunity for advanced high schoolers.",
    },
    {
      gradeLevel: "grade_12",
      category: "certifications",
      title: "CompTIA Security+; Certified Ethical Hacker (CEH)",
      description: "Security+ and CEH are real, industry-standard entry credentials for this track.",
    },
  ],
};
