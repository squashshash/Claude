import type { ClubCategory } from "@/components/panel/clubs-constellation";

/**
 * Common US high school clubs and student organisations, for the club picker.
 *
 * Scope: nationally-recognised organisations (CTSOs, honor societies, academic
 * competition circuits) plus club types that are near-universal in US high
 * schools. Chapter availability varies enormously school to school, so this is
 * an autocomplete to save typing — never a claim that a given club exists at
 * the student's school. Free text stays allowed for anything not listed.
 */
export interface ClubOption {
  name: string;
  category: ClubCategory;
  /** Expanded name or parent organisation, shown as a hint in the picker. */
  hint?: string;
}

export const CLUB_CATALOG: ClubOption[] = [
  // Career & Technical Student Organizations (federally recognised CTSOs)
  { name: "DECA", category: "other", hint: "Marketing, finance, hospitality & management CTSO" },
  { name: "FBLA", category: "other", hint: "Future Business Leaders of America" },
  { name: "HOSA", category: "stem", hint: "HOSA – Future Health Professionals" },
  { name: "FFA", category: "other", hint: "National FFA Organization (agriculture)" },
  { name: "FCCLA", category: "other", hint: "Family, Career & Community Leaders of America" },
  { name: "SkillsUSA", category: "other", hint: "Trade, technical & skilled service careers" },
  { name: "TSA", category: "stem", hint: "Technology Student Association" },
  { name: "Business Professionals of America", category: "other", hint: "BPA" },
  { name: "Educators Rising", category: "other", hint: "Future teachers CTSO" },

  // Honor societies
  { name: "National Honor Society", category: "service", hint: "NHS" },
  { name: "National Junior Honor Society", category: "service", hint: "NJHS" },
  { name: "Mu Alpha Theta", category: "stem", hint: "Mathematics honor society" },
  { name: "Science National Honor Society", category: "stem", hint: "SNHS" },
  { name: "National Art Honor Society", category: "arts", hint: "NAHS" },
  { name: "Tri-M Music Honor Society", category: "arts" },
  { name: "National English Honor Society", category: "other", hint: "NEHS" },
  { name: "Rho Kappa", category: "other", hint: "Social studies honor society" },
  { name: "Quill and Scroll", category: "other", hint: "Journalism honor society" },
  { name: "Spanish National Honor Society", category: "other", hint: "Sociedad Honoraria Hispánica" },
  { name: "French National Honor Society", category: "other", hint: "Société Honoraire de Français" },
  { name: "National Latin Honor Society", category: "other" },
  { name: "International Thespian Society", category: "arts", hint: "Theatre honor society" },

  // Academic competition
  { name: "Science Olympiad", category: "stem" },
  { name: "Academic Decathlon", category: "other", hint: "USAD" },
  { name: "Quiz Bowl", category: "other", hint: "Also called Scholar Bowl or Academic Team" },
  { name: "Model United Nations", category: "other", hint: "Model UN" },
  { name: "Speech and Debate", category: "other", hint: "NSDA" },
  { name: "Mock Trial", category: "other" },
  { name: "Math Team", category: "stem", hint: "Math League / AMC preparation" },
  { name: "Robotics Team", category: "stem", hint: "FIRST, VEX or BEST robotics" },
  { name: "CyberPatriot", category: "stem", hint: "National youth cyber defense competition" },
  { name: "Envirothon", category: "stem", hint: "Environmental science competition" },
  { name: "Ocean Sciences Bowl", category: "stem" },
  { name: "History Bowl", category: "other" },

  // STEM
  { name: "Computer Science Club", category: "stem" },
  { name: "Coding Club", category: "stem" },
  { name: "Engineering Club", category: "stem" },
  { name: "Rocketry Club", category: "stem", hint: "American Rocketry Challenge" },
  { name: "Astronomy Club", category: "stem" },
  { name: "Chemistry Club", category: "stem" },
  { name: "Biology Club", category: "stem" },
  { name: "Physics Club", category: "stem" },
  { name: "Chess Club", category: "stem" },
  { name: "Game Development Club", category: "stem" },
  { name: "Drone Club", category: "stem" },

  // Arts & media
  { name: "Drama Club", category: "arts" },
  { name: "Marching Band", category: "arts" },
  { name: "Concert Band", category: "arts" },
  { name: "Jazz Band", category: "arts" },
  { name: "Orchestra", category: "arts" },
  { name: "Choir", category: "arts" },
  { name: "Show Choir", category: "arts" },
  { name: "A Cappella Group", category: "arts" },
  { name: "Art Club", category: "arts" },
  { name: "Photography Club", category: "arts" },
  { name: "Film Club", category: "arts" },
  { name: "Dance Team", category: "arts" },
  { name: "Color Guard", category: "arts" },
  { name: "Yearbook", category: "arts" },
  { name: "School Newspaper", category: "arts" },
  { name: "Literary Magazine", category: "arts" },
  { name: "Broadcast Journalism", category: "arts", hint: "Morning announcements / school TV" },
  { name: "Creative Writing Club", category: "arts" },

  // Service & advocacy
  { name: "Key Club", category: "service", hint: "Kiwanis-sponsored service organisation" },
  { name: "Interact Club", category: "service", hint: "Rotary-sponsored service organisation" },
  { name: "National Beta Club", category: "service" },
  { name: "Red Cross Club", category: "service" },
  { name: "Habitat for Humanity Club", category: "service" },
  { name: "Best Buddies", category: "service" },
  { name: "Environmental Club", category: "service" },
  { name: "Recycling Club", category: "service" },
  { name: "Community Service Club", category: "service" },
  { name: "Peer Tutoring", category: "service" },
  { name: "Peer Mediation", category: "service" },
  { name: "Special Olympics Club", category: "service" },

  // Leadership & affinity
  { name: "Student Government", category: "other", hint: "Student Council / ASB" },
  { name: "Class Officers", category: "other" },
  { name: "Black Student Union", category: "other" },
  { name: "Latino Student Union", category: "other" },
  { name: "Asian Student Association", category: "other" },
  { name: "Gender & Sexuality Alliance", category: "other", hint: "GSA" },
  { name: "Muslim Student Association", category: "other" },
  { name: "Jewish Student Union", category: "other" },
  { name: "International Club", category: "other" },
  { name: "Multicultural Club", category: "other" },

  // Athletics-adjacent
  { name: "Esports Team", category: "athletics" },
  { name: "Ultimate Frisbee Club", category: "athletics" },
  { name: "Outdoor / Hiking Club", category: "athletics" },
  { name: "Weightlifting Club", category: "athletics" },
  { name: "Yoga Club", category: "athletics" },
  { name: "Intramural Sports", category: "athletics" },
];

export const CLUB_NAMES = CLUB_CATALOG.map((c) => c.name);

/** Case-insensitive prefix-then-substring match, best matches first. */
export function searchClubs(query: string, limit = 8): ClubOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: ClubOption[] = [];
  const contains: ClubOption[] = [];
  for (const club of CLUB_CATALOG) {
    const name = club.name.toLowerCase();
    const hint = club.hint?.toLowerCase() ?? "";
    if (name.startsWith(q)) starts.push(club);
    else if (name.includes(q) || hint.includes(q)) contains.push(club);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

export function findClub(name: string): ClubOption | undefined {
  const target = name.trim().toLowerCase();
  return CLUB_CATALOG.find((c) => c.name.toLowerCase() === target);
}
