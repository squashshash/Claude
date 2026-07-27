"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CERTIFICATION_AGE_RULES, getAgeRule } from "@/lib/roadmap/age-rules";

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
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CERTIFICATION_AGE_RULES.filter(
      (c) =>
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [query]);

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
