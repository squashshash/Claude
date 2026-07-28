import { Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";

const SAMPLE_PROGRAMS = [
  { name: "Research Science Institute (RSI)", grades: "Rising seniors", funded: true },
  { name: "Simons Summer Research Program", grades: "Rising seniors", funded: true },
  { name: "National Youth Science Camp", grades: "Graduating seniors", funded: true },
  { name: "University Pre-College Engineering Program", grades: "Grades 10-12", funded: false },
  { name: "Journal of Emerging Investigators mentorship track", grades: "Grades 9-12", funded: true },
];

export function SummerPrograms() {
  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample programs — a real directory needs a maintained, verified list with
        current deadlines, which isn&apos;t sourced yet. Layout is real.
      </SampleDataBanner>
      <div className="grid gap-4 sm:grid-cols-2">
        {SAMPLE_PROGRAMS.map((p) => (
          <Card key={p.name}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sun className="h-4 w-4" aria-hidden="true" />
                <Badge variant={p.funded ? "default" : "outline"}>{p.funded ? "Fully funded" : "Paid program"}</Badge>
              </div>
              <p className="font-display text-lg font-bold leading-snug">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.grades}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
