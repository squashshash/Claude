"use client";

import { Briefcase, MapPin, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { MOCK_STUDENT } from "@/lib/mock-data";
import type { CareerTrack } from "@/lib/constants";

const SAMPLE_JOBS: {
  title: string;
  employer: string;
  location: string;
  pay: string;
  minAge: number;
  track: CareerTrack;
}[] = [
  { title: "Pharmacy Technician Trainee", employer: "Neighborhood Pharmacy", location: "Hybrid · after school", pay: "$14-16/hr", minAge: 16, track: "pre_med_clinical_healthcare" },
  { title: "Dietary Aide", employer: "Riverside Care Center", location: "On-site · weekends", pay: "$13-15/hr", minAge: 16, track: "nursing_advanced_practice" },
  { title: "Junior Web Developer", employer: "Local nonprofit", location: "Remote · flexible", pay: "$16-20/hr", minAge: 15, track: "software_engineering" },
  { title: "Lab Assistant (Work-Study)", employer: "State University Bio Dept.", location: "On-site · summer", pay: "$15/hr", minAge: 16, track: "pre_med_clinical_healthcare" },
  { title: "CAD Drafting Intern", employer: "Regional Engineering Firm", location: "On-site · summer", pay: "Unpaid + stipend", minAge: 16, track: "mechanical_engineering_cad" },
  { title: "Bank Teller Trainee", employer: "Community Credit Union", location: "On-site · after school", pay: "$14-17/hr", minAge: 16, track: "financial_engineering" },
  { title: "Law Office File Clerk", employer: "Local Family Law Practice", location: "On-site · weekends", pay: "$13-15/hr", minAge: 16, track: "law_public_policy" },
];

export function JobBoard() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile);
  const targetCareer = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;

  const sorted = [...SAMPLE_JOBS].sort((a, b) => {
    const aMatch = a.track === targetCareer ? 0 : 1;
    const bMatch = b.track === targetCareer ? 0 : 1;
    return aMatch - bMatch;
  });

  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample listings — a real board needs a job-postings integration or partner
        employers, which isn&apos;t wired up yet. Layout, sorting, and track-matching logic are real.
      </SampleDataBanner>
      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((job) => (
          <Card key={job.title}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                <Badge variant="outline">Age {job.minAge}+</Badge>
                {job.track === targetCareer && (
                  <Badge variant="accent" className="gap-1">
                    <GraduationCap className="h-3 w-3" /> Matches your track
                  </Badge>
                )}
              </div>
              <p className="font-display text-lg font-bold leading-snug">{job.title}</p>
              <p className="text-sm text-muted-foreground">{job.employer}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {job.pay}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
