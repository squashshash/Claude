"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CERTIFICATION_AGE_RULES, getAgeRule } from "@/lib/roadmap/age-rules";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { CAREER_TRACK_LABELS, type CareerTrack } from "@/lib/constants";

// Which cert catalog category is most relevant to each career track. Law &
// Public Policy has no direct match in this catalog (no legal-credential
// entries exist yet), so it's intentionally left unmapped rather than
// forced onto an unrelated category.
const TRACK_TO_CERT_CATEGORY: Partial<Record<CareerTrack, string>> = {
  pre_med_clinical_healthcare: "healthcare",
  nursing_advanced_practice: "healthcare",
  software_engineering: "technology",
  financial_engineering: "finance",
  mechanical_engineering_cad: "engineering",
};

const STATES = [
  { code: "", label: "Any state (default rules)" },
  { code: "CA", label: "California" },
  { code: "FL", label: "Florida" },
  { code: "TX", label: "Texas" },
];

const CATEGORY_LABEL: Record<string, string> = {
  healthcare: "Healthcare",
  finance: "Finance",
  engineering: "Engineering",
  technology: "Technology",
};

export function CertificationRulebook() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile);
  const targetCareer = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;
  const trackCategory = TRACK_TO_CERT_CATEGORY[targetCareer];

  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [trackOnly, setTrackOnly] = useState(Boolean(trackCategory));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CERTIFICATION_AGE_RULES.filter((c) => {
      if (trackOnly && trackCategory && c.category !== trackCategory) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [query, trackOnly, trackCategory]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-input bg-background px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search certifications (CNA, phlebotomy, AWS...)"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-full border border-input bg-background px-4 py-2 text-sm"
          >
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {trackCategory && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            variant={trackOnly ? "default" : "outline"}
            onClick={() => setTrackOnly((v) => !v)}
          >
            {trackOnly ? "Showing" : "Show"} only certs relevant to {CAREER_TRACK_LABELS[targetCareer]}
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {results.length} of {CERTIFICATION_AGE_RULES.length} certifications
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((cert) => {
          const rule = getAgeRule(cert.title, state || undefined) ?? cert.defaultRule;
          const stateSpecific = state && cert.stateOverrides?.[state];

          return (
            <Card key={cert.title}>
              <CardContent className="flex flex-col gap-2 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <Badge variant="outline">{CATEGORY_LABEL[cert.category] ?? cert.category}</Badge>
                  </div>
                  <Badge variant={rule.minAge === 0 ? "default" : "accent"}>
                    {rule.minAge === 0 ? "No age floor" : `Age ${rule.minAge}+`}
                  </Badge>
                </div>
                <p className="font-display text-lg font-bold leading-snug">{cert.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
                {rule.notes && (
                  <p className="rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">{rule.notes}</p>
                )}
                {stateSpecific && (
                  <Badge variant="locked" className="w-fit">
                    {STATES.find((s) => s.code === state)?.label} rule applied
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
