import { describe, it, expect } from "vitest";
import {
  isLeadershipRole,
  xpForExamScore,
  EXAM_GOOD_SCORE_XP,
  EXAM_OK_SCORE_XP,
} from "./constants";

describe("isLeadershipRole", () => {
  it("recognises common leadership titles", () => {
    for (const role of ["President", "Vice President", "Captain", "Treasurer", "Founder"]) {
      expect(isLeadershipRole(role)).toBe(true);
    }
  });

  it("is case-insensitive and matches inside a longer title", () => {
    expect(isLeadershipRole("co-captain")).toBe(true);
    expect(isLeadershipRole("Junior Varsity Team CAPTAIN")).toBe(true);
  });

  it("does not treat ordinary membership as leadership", () => {
    for (const role of ["Member", "Participant", "Volunteer", "Player"]) {
      expect(isLeadershipRole(role)).toBe(false);
    }
  });

  it("handles absent roles without throwing", () => {
    expect(isLeadershipRole(null)).toBe(false);
    expect(isLeadershipRole(undefined)).toBe(false);
    expect(isLeadershipRole("")).toBe(false);
  });
});

describe("xpForExamScore", () => {
  it("awards the full amount at or above the good threshold", () => {
    expect(xpForExamScore(90)).toBe(EXAM_GOOD_SCORE_XP);
    expect(xpForExamScore(100)).toBe(EXAM_GOOD_SCORE_XP);
  });

  it("awards the partial amount in the ok band", () => {
    expect(xpForExamScore(75)).toBe(EXAM_OK_SCORE_XP);
    expect(xpForExamScore(89.5)).toBe(EXAM_OK_SCORE_XP);
  });

  it("awards nothing below the ok threshold", () => {
    expect(xpForExamScore(74.9)).toBe(0);
    expect(xpForExamScore(0)).toBe(0);
  });

  it("awards nothing when no score has been entered", () => {
    expect(xpForExamScore(null)).toBe(0);
    expect(xpForExamScore(undefined)).toBe(0);
  });

  it("nets to zero when a score is edited and then cleared", () => {
    // Mirrors how the PATCH route computes its delta: new minus old.
    const awarded = xpForExamScore(95) - xpForExamScore(null);
    const revoked = xpForExamScore(null) - xpForExamScore(95);
    expect(awarded + revoked).toBe(0);
  });
});
