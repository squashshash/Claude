"use client";

import { ExternalLink, ShieldCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BsMdProgram {
  institution: string;
  program: string;
  minGpa: string;
  minTest: string;
  admissionType: "Guaranteed" | "Conditional";
  url: string;
  note?: string;
}

// Independently verified against each program's own admissions page — not taken
// on faith from a single research pass. Everything else in the AAMC directory
// stays out of this list until it's checked the same way.
const VERIFIED_PROGRAMS: BsMdProgram[] = [
  {
    institution: "George Washington University",
    program: "7-Year BA/BS-MD (4+4) Program",
    minGpa: "3.60 cumulative GPA",
    minTest: "Competitive (roughly 90th percentile SAT/ACT)",
    admissionType: "Conditional",
    url: "https://smhs.gwu.edu/md-program/admissions/bamd",
  },
  {
    institution: "Howard University",
    program: "BS/MD Program",
    minGpa: "3.5 GPA",
    minTest: "SAT 1300+ or ACT 28+",
    admissionType: "Conditional",
    url: "https://medicine.howard.edu/education/dual-degree-programs",
  },
  {
    institution: "University of South Florida",
    program: "7-Year BS/MD Program",
    minGpa: "4.0 weighted high school GPA",
    minTest: "SAT 1500+ or ACT 34+",
    admissionType: "Conditional",
    note: "Also requires a 518+ MCAT to continue into the medical school phase.",
    url: "https://www.usf.edu/honors/programs/7-year-med-faqs.aspx",
  },
  {
    institution: "University of Alabama at Birmingham",
    program: "EMSAP (Early Medical School Acceptance Program)",
    minGpa: "3.5 GPA",
    minTest: "SAT 1360+ or ACT 30+",
    admissionType: "Conditional",
    url: "https://www.uab.edu/students/academics/emsap",
  },
  {
    institution: "Brown University",
    program: "PLME (Program in Liberal Medical Education)",
    minGpa: "Not published",
    minTest: "Not published — no MCAT required to matriculate",
    admissionType: "Conditional",
    note: "Brown deliberately doesn't publish numeric cutoffs; admission is holistic.",
    url: "https://admission.brown.edu/plme",
  },
];

export function DirectAdmitPlanner() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="border-accent/50 bg-accent/10">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          There are roughly 50-70 BS/MD programs nationally (see AAMC&apos;s full list below), but a
          wrong GPA or test-score number here could steer a real medical-admissions decision. Only the
          5 programs below have been individually checked against their own admissions pages — that&apos;s
          it, on purpose. Nothing else was added on the strength of a single unverified source.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Independently verified programs</CardTitle>
          <CardDescription>
            Confirm every number against the linked official page before relying on it — programs
            change requirements year to year.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {VERIFIED_PROGRAMS.map((p) => (
            <div key={p.institution} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-base font-bold">{p.institution}</p>
                <Badge variant={p.admissionType === "Guaranteed" ? "default" : "accent"}>
                  {p.admissionType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{p.program}</p>
              <div className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-medium text-foreground">Min. GPA:</span> {p.minGpa}
                </p>
                <p>
                  <span className="font-medium text-foreground">Min. test score:</span> {p.minTest}
                </p>
              </div>
              {p.note && <p className="mt-1 text-xs italic text-muted-foreground">{p.note}</p>}
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Official admissions page
              </a>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          For every other BS/MD program, use the AAMC&apos;s own official directory rather than a
          third-party list — it&apos;s the authoritative, annually-updated source.
          <a
            href="https://students-residents.aamc.org/medical-school-admission-requirements/medical-schools-offering-combined-baccalaureate-md-programs-state-and-program-length-2025-2026"
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex items-center gap-1 font-medium text-accent underline"
          >
            AAMC combined baccalaureate-MD directory <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
