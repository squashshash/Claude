import { Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";

const SAMPLE_GRANTS = [
  { name: "HOSA Future Health Professionals Grant", amount: "$500", covers: "Competition travel & registration" },
  { name: "Local Rotary Youth STEM Award", amount: "$250-$750", covers: "Certification exam fees" },
  { name: "Regional CTSO Uniform Stipend", amount: "$250", covers: "Scrubs / competition attire" },
  { name: "First-Gen Student Certification Fund", amount: "$1,000", covers: "Any single credentialing exam" },
];

export function GrantFinder() {
  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample grants — a real finder needs a maintained database of live programs,
        which isn&apos;t sourced yet. Layout and structure are real.
      </SampleDataBanner>
      <div className="grid gap-4 sm:grid-cols-2">
        {SAMPLE_GRANTS.map((g) => (
          <Card key={g.name}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gift className="h-4 w-4" aria-hidden="true" />
                <Badge variant="accent">{g.amount}</Badge>
              </div>
              <p className="font-display text-lg font-bold leading-snug">{g.name}</p>
              <p className="text-sm text-muted-foreground">Covers: {g.covers}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
