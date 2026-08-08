import { describe, it, expect } from "vitest";
import { getAgeRule, isTooYoung, estimateAgeFromGrade } from "./age-rules";

describe("getAgeRule", () => {
  it("returns the default rule when no state is given", () => {
    expect(getAgeRule("Certified Nursing Assistant (CNA)")?.minAge).toBe(16);
  });

  it("prefers a state override where one exists", () => {
    expect(getAgeRule("Certified Nursing Assistant (CNA)", "CA")?.minAge).toBe(18);
  });

  it("falls back to the default for a state with no override", () => {
    expect(getAgeRule("Certified Nursing Assistant (CNA)", "NY")?.minAge).toBe(16);
  });

  it("returns undefined for an unknown certification", () => {
    expect(getAgeRule("Not A Real Certification")).toBeUndefined();
  });
});

describe("isTooYoung", () => {
  it("gates the FINRA SIE below 18", () => {
    const sie = "FINRA Securities Industry Essentials (SIE) Exam";
    expect(isTooYoung(sie, 17)).toBe(true);
    expect(isTooYoung(sie, 18)).toBe(false);
  });

  it("applies California's stricter CNA floor", () => {
    const cna = "Certified Nursing Assistant (CNA)";
    expect(isTooYoung(cna, 17, "CA")).toBe(true);
    expect(isTooYoung(cna, 17, "TX")).toBe(false);
  });

  it("does not gate age-neutral certifications", () => {
    expect(isTooYoung("AWS Certified Cloud Practitioner", 13)).toBe(false);
  });

  it("does not gate an unknown certification", () => {
    expect(isTooYoung("Not A Real Certification", 10)).toBe(false);
  });
});

describe("estimateAgeFromGrade", () => {
  it("maps each grade tier to a typical age", () => {
    expect(estimateAgeFromGrade("summer_0")).toBe(13);
    expect(estimateAgeFromGrade("grade_9")).toBe(14);
    expect(estimateAgeFromGrade("grade_12")).toBe(17);
  });

  it("increases monotonically across tiers", () => {
    const ages = (["summer_0", "grade_9", "grade_10", "grade_11", "grade_12"] as const).map(
      estimateAgeFromGrade
    );
    for (let i = 1; i < ages.length; i++) {
      expect(ages[i]).toBeGreaterThan(ages[i - 1]!);
    }
  });
});
