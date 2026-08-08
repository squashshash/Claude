/**
 * Common US high school sports, for the sport picker.
 *
 * Drawn from the sports the NFHS (National Federation of State High School
 * Associations) publishes participation data for, plus widely-offered
 * emerging sports. Which of these a given school or state association
 * actually sanctions varies — this is an autocomplete, not a claim of
 * availability. Free text stays allowed.
 */
export type SportSeason = "Fall" | "Winter" | "Spring" | "Year-round";

export interface SportOption {
  name: string;
  /** The season this is most commonly played in US high schools; varies by state. */
  season: SportSeason;
}

export const SPORT_CATALOG: SportOption[] = [
  // Fall
  { name: "Football", season: "Fall" },
  { name: "Soccer", season: "Fall" },
  { name: "Volleyball", season: "Fall" },
  { name: "Cross Country", season: "Fall" },
  { name: "Field Hockey", season: "Fall" },
  { name: "Golf", season: "Fall" },
  { name: "Water Polo", season: "Fall" },
  { name: "Cheerleading", season: "Fall" },
  { name: "Marching Band", season: "Fall" },

  // Winter
  { name: "Basketball", season: "Winter" },
  { name: "Wrestling", season: "Winter" },
  { name: "Swimming and Diving", season: "Winter" },
  { name: "Indoor Track and Field", season: "Winter" },
  { name: "Ice Hockey", season: "Winter" },
  { name: "Bowling", season: "Winter" },
  { name: "Gymnastics", season: "Winter" },
  { name: "Competitive Cheer", season: "Winter" },
  { name: "Skiing", season: "Winter" },
  { name: "Snowboarding", season: "Winter" },
  { name: "Rifle", season: "Winter" },

  // Spring
  { name: "Baseball", season: "Spring" },
  { name: "Softball", season: "Spring" },
  { name: "Track and Field", season: "Spring" },
  { name: "Tennis", season: "Spring" },
  { name: "Lacrosse", season: "Spring" },
  { name: "Rowing", season: "Spring" },
  { name: "Rugby", season: "Spring" },
  { name: "Badminton", season: "Spring" },
  { name: "Sailing", season: "Spring" },

  // Year-round / varies
  { name: "Esports", season: "Year-round" },
  { name: "Fencing", season: "Year-round" },
  { name: "Equestrian", season: "Year-round" },
  { name: "Weightlifting", season: "Year-round" },
  { name: "Dance Team", season: "Year-round" },
  { name: "Ultimate Frisbee", season: "Year-round" },
  { name: "Archery", season: "Year-round" },
  { name: "Surfing", season: "Year-round" },
  { name: "Table Tennis", season: "Year-round" },
  { name: "Unified Sports", season: "Year-round" },
];

export const SPORT_NAMES = SPORT_CATALOG.map((s) => s.name);

export function searchSports(query: string, limit = 8): SportOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const starts: SportOption[] = [];
  const contains: SportOption[] = [];
  for (const sport of SPORT_CATALOG) {
    const name = sport.name.toLowerCase();
    if (name.startsWith(q)) starts.push(sport);
    else if (name.includes(q)) contains.push(sport);
    if (starts.length >= limit) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

export function findSport(name: string): SportOption | undefined {
  const target = name.trim().toLowerCase();
  return SPORT_CATALOG.find((s) => s.name.toLowerCase() === target);
}
