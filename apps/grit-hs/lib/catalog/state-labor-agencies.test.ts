import { describe, it, expect } from "vitest";
import { STATE_LABOR_AGENCIES, findStateLaborAgency } from "./state-labor-agencies";

const US_STATE_ABBREVIATIONS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

describe("STATE_LABOR_AGENCIES", () => {
  it("covers exactly the 50 states plus DC, no more no less", () => {
    const abbreviations = STATE_LABOR_AGENCIES.map((s) => s.abbreviation).sort();
    expect(abbreviations).toEqual([...US_STATE_ABBREVIATIONS].sort());
    expect(STATE_LABOR_AGENCIES).toHaveLength(51);
  });

  it("has no duplicate abbreviations", () => {
    const abbreviations = STATE_LABOR_AGENCIES.map((s) => s.abbreviation);
    expect(new Set(abbreviations).size).toBe(abbreviations.length);
  });

  it("gives every entry a real agency name and a valid https URL", () => {
    for (const entry of STATE_LABOR_AGENCIES) {
      expect(entry.agency.trim().length).toBeGreaterThan(0);
      expect(() => new URL(entry.officialUrl)).not.toThrow();
      expect(entry.officialUrl.startsWith("https://")).toBe(true);
    }
  });

  it("never hardcodes a specific hour limit — this directory only ever points to the source", () => {
    // Guards against someone later "helpfully" adding fabricated per-state
    // hour figures back into this file (see the file-level comment for why).
    for (const entry of STATE_LABOR_AGENCIES) {
      expect(entry.note ?? "").not.toMatch(/\d+\s*hours?/i);
    }
  });
});

describe("findStateLaborAgency", () => {
  it("finds a state case-insensitively", () => {
    expect(findStateLaborAgency("ca")?.agency).toContain("Division of Labor Standards Enforcement");
    expect(findStateLaborAgency("CA")?.agency).toContain("Division of Labor Standards Enforcement");
  });

  it("returns undefined for an invalid abbreviation", () => {
    expect(findStateLaborAgency("ZZ")).toBeUndefined();
  });
});
