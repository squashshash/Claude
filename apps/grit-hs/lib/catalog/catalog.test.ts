import { describe, it, expect } from "vitest";
import { CLUB_CATALOG, searchClubs, findClub } from "./clubs";
import { SPORT_CATALOG, searchSports, findSport } from "./sports";
import { COURSE_CATALOG, searchCourses, findCourse } from "./courses";

describe("catalog integrity", () => {
  it("has no duplicate club names", () => {
    const names = CLUB_CATALOG.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has no duplicate sport names", () => {
    const names = SPORT_CATALOG.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has no duplicate course names", () => {
    const names = COURSE_CATALOG.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every entry a non-empty name", () => {
    for (const entry of [...CLUB_CATALOG, ...SPORT_CATALOG, ...COURSE_CATALOG]) {
      expect(entry.name.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("searchClubs", () => {
  it("finds a club by name prefix", () => {
    expect(searchClubs("robot").map((c) => c.name)).toContain("Robotics Team");
  });

  it("is case-insensitive", () => {
    expect(searchClubs("DECA").length).toBeGreaterThan(0);
    expect(searchClubs("deca").length).toBeGreaterThan(0);
  });

  it("matches on the hint as well as the name", () => {
    // "Kiwanis" only appears in Key Club's hint.
    expect(searchClubs("kiwanis").map((c) => c.name)).toContain("Key Club");
  });

  it("returns nothing for an empty query", () => {
    expect(searchClubs("")).toEqual([]);
    expect(searchClubs("   ")).toEqual([]);
  });

  it("respects the result limit", () => {
    expect(searchClubs("c", 3).length).toBeLessThanOrEqual(3);
  });
});

describe("searchSports", () => {
  it("finds a sport by prefix", () => {
    expect(searchSports("bask").map((s) => s.name)).toContain("Basketball");
  });

  it("returns nothing for an empty query", () => {
    expect(searchSports("")).toEqual([]);
  });
});

describe("searchCourses", () => {
  it("finds AP courses by prefix", () => {
    expect(searchCourses("AP Calc").map((c) => c.name)).toContain("AP Calculus AB");
  });

  it("finds a course by a word in the middle of its name", () => {
    expect(searchCourses("physiology").map((c) => c.name)).toContain("Anatomy and Physiology");
  });

  it("returns nothing for an empty query", () => {
    expect(searchCourses("")).toEqual([]);
  });
});

describe("exact lookups", () => {
  it("resolves a club to its category", () => {
    expect(findClub("HOSA")?.category).toBe("stem");
    expect(findClub("Key Club")?.category).toBe("service");
  });

  it("resolves a sport to its typical season", () => {
    expect(findSport("Basketball")?.season).toBe("Winter");
    expect(findSport("Baseball")?.season).toBe("Spring");
  });

  it("resolves a course to its level", () => {
    expect(findCourse("AP Biology")?.level).toBe("AP");
    expect(findCourse("Algebra I")?.level).toBe("Core");
  });

  it("ignores surrounding whitespace and case", () => {
    expect(findClub("  key club  ")?.name).toBe("Key Club");
  });

  it("returns undefined for something not in the catalog", () => {
    expect(findClub("Underwater Basket Weaving Club")).toBeUndefined();
    expect(findSport("Quidditch")).toBeUndefined();
    expect(findCourse("Advanced Nonsense")).toBeUndefined();
  });
});
