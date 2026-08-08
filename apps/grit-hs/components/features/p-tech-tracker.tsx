"use client";

import { useState } from "react";
import { GraduationCap, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function PTechTracker() {
  const [schoolName, setSchoolName] = useState("");
  const [industryPartner, setIndustryPartner] = useState("");
  const [degreeTarget, setDegreeTarget] = useState("");
  const [yearInProgram, setYearInProgram] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          There&apos;s no single national database of P-TECH schools with an open API, so this doesn&apos;t
          try to look yours up automatically — and the old ptech.org directory is no longer live. IBM,
          the model&apos;s original industry partner, still maintains a real overview page:{" "}
          <a
            href="https://www.ibm.com/thought-leadership/ptech/index.html"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline"
          >
            IBM&apos;s P-TECH overview
          </a>
          . For your own school&apos;s exact details, ask your CTE coordinator or counselor, then track
          it here yourself.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What P-TECH actually is</CardTitle>
          <CardDescription>
            A real 9th–14th grade model (roughly 300–400 designated schools nationwide), each pairing a
            high school with a community college and an industry partner.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Tuition-free path:</span> students can earn
            a no-cost Associate of Applied Science (AAS) degree or industry credential alongside their
            high school diploma, typically over 6 years (grades 9–14).
          </p>
          <p>
            <span className="font-semibold text-foreground">Industry partnership:</span> a local
            employer provides mentoring, workplace visits, and often a first-in-line internship or job
            interview for graduates.
          </p>
          <p>
            <span className="font-semibold text-foreground">Where it started:</span> the first P-TECH
            opened in Brooklyn in September 2011 — a partnership between NYC Public Schools, CUNY&apos;s
            New York City College of Technology, and IBM. Over 300 schools nationwide now follow the
            same model.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your program</CardTitle>
          <CardDescription>Fill this in from your own school&apos;s materials.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">High school</span>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Industry partner</span>
            <input
              value={industryPartner}
              onChange={(e) => setIndustryPartner(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Target degree/credential</span>
            <input
              value={degreeTarget}
              onChange={(e) => setDegreeTarget(e.target.value)}
              placeholder="e.g. AAS in Computer Information Systems"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Current year in program</span>
            <Select value={yearInProgram} onChange={(e) => setYearInProgram(e.target.value)}>
              <option value="">Select…</option>
              {["9", "10", "11", "12", "13", "14"].map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </Select>
          </label>
          {schoolName && (
            <div className="sm:col-span-2">
              <Badge variant="default">
                {schoolName}
                {yearInProgram ? ` · Year ${yearInProgram} of 6` : ""}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          CTECH (state-specific Career &amp; Technical Education Center) programs vary too much by
          district to have a single national directory — check with your school&apos;s CTE
          coordinator directly for local CTECH options.
        </CardContent>
      </Card>
    </div>
  );
}
