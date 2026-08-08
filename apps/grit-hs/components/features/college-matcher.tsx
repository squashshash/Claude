"use client";

import { useState } from "react";
import { GraduationCap, Info, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type SortKey = "admit_rate" | "cost" | "earnings";

interface ScorecardResult {
  id: number;
  "school.name": string;
  "school.city": string;
  "school.state": string;
  "school.ownership": number | null;
  "latest.student.size": number | null;
  "latest.cost.tuition.in_state": number | null;
  "latest.cost.tuition.out_of_state": number | null;
  "latest.admissions.admission_rate.overall": number | null;
  "latest.earnings.10_yrs_after_entry.median": number | null;
}

const OWNERSHIP_LABEL: Record<number, string> = {
  1: "Public",
  2: "Private nonprofit",
  3: "Private for-profit",
};

function formatMoney(n: number | null): string {
  return n == null ? "—" : `$${n.toLocaleString()}`;
}

export function CollegeMatcher() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");
  const [sort, setSort] = useState<SortKey>("admit_rate");
  const [results, setResults] = useState<ScorecardResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "not_configured" | "error" | "done">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setNotice(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (state.trim()) params.set("state", state.trim());
      const res = await fetch(`/api/college-matcher?${params.toString()}`);
      const body = await res.json();
      if (res.status === 501) {
        setStatus("not_configured");
        setNotice(body.error);
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setNotice(body.error ?? "Something went wrong.");
        return;
      }
      setResults(body.results ?? []);
      setStatus("done");
    } catch {
      setStatus("error");
      setNotice("Couldn't reach the server.");
    }
  };

  const sorted = [...results].sort((a, b) => {
    if (sort === "admit_rate") {
      return (a["latest.admissions.admission_rate.overall"] ?? 1) -
        (b["latest.admissions.admission_rate.overall"] ?? 1);
    }
    if (sort === "cost") {
      return (a["latest.cost.tuition.in_state"] ?? Infinity) - (b["latest.cost.tuition.in_state"] ?? Infinity);
    }
    return (
      (b["latest.earnings.10_yrs_after_entry.median"] ?? 0) -
      (a["latest.earnings.10_yrs_after_entry.median"] ?? 0)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Real data from the U.S. Department of Education&apos;s College Scorecard — admission rate,
          tuition, and 10-year median earnings for over 6,000 institutions. Search by school name and/or
          state.
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={search} className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-muted-foreground">School name</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. University of Michigan"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">State (optional)</span>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. TX"
                maxLength={2}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm uppercase outline-none"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
              <Button type="submit" size="sm" className="gap-2" disabled={status === "loading"}>
                <Search className="h-3.5 w-3.5" />
                {status === "loading" ? "Searching…" : "Search colleges"}
              </Button>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Sort by
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-8 w-auto py-1"
                >
                  <option value="admit_rate">Most selective</option>
                  <option value="cost">Lowest in-state tuition</option>
                  <option value="earnings">Highest 10-yr earnings</option>
                </Select>
              </label>
            </div>
          </form>
        </CardContent>
      </Card>

      {notice && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">{notice}</CardContent>
        </Card>
      )}

      {status === "done" && sorted.length === 0 && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            No schools matched that search.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((school) => (
          <Card key={school.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-bold leading-snug">{school["school.name"]}</p>
                  <p className="text-sm text-muted-foreground">
                    {school["school.city"]}, {school["school.state"]}
                  </p>
                </div>
                <GraduationCap className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              </div>
              {school["school.ownership"] && (
                <Badge variant="outline" className="w-fit">
                  {OWNERSHIP_LABEL[school["school.ownership"]] ?? "Unknown"}
                </Badge>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Admission rate</p>
                  <p className="font-semibold">
                    {school["latest.admissions.admission_rate.overall"] != null
                      ? `${Math.round(school["latest.admissions.admission_rate.overall"] * 100)}%`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">In-state tuition</p>
                  <p className="font-semibold">{formatMoney(school["latest.cost.tuition.in_state"])}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">10-yr median earnings</p>
                  <p className="font-semibold">
                    {formatMoney(school["latest.earnings.10_yrs_after_entry.median"])}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Enrollment</p>
                  <p className="font-semibold">
                    {school["latest.student.size"]?.toLocaleString() ?? "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
