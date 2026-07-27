import { Briefcase, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";

const SAMPLE_JOBS = [
  { title: "Pharmacy Technician Trainee", employer: "Neighborhood Pharmacy", location: "Hybrid · after school", pay: "$14-16/hr", minAge: 16 },
  { title: "Dietary Aide", employer: "Riverside Care Center", location: "On-site · weekends", pay: "$13-15/hr", minAge: 16 },
  { title: "Junior Web Developer", employer: "Local nonprofit", location: "Remote · flexible", pay: "$16-20/hr", minAge: 15 },
  { title: "Lab Assistant (Work-Study)", employer: "State University Bio Dept.", location: "On-site · summer", pay: "$15/hr", minAge: 16 },
  { title: "CAD Drafting Intern", employer: "Regional Engineering Firm", location: "On-site · summer", pay: "Unpaid + stipend", minAge: 16 },
];

export function JobBoard() {
  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample listings — a real board needs a job-postings integration or partner
        employers, which isn&apos;t wired up yet. Layout and filtering logic are real.
      </SampleDataBanner>
      <div className="grid gap-4 sm:grid-cols-2">
        {SAMPLE_JOBS.map((job) => (
          <Card key={job.title}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" aria-hidden="true" />
                <Badge variant="outline">Age {job.minAge}+</Badge>
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
