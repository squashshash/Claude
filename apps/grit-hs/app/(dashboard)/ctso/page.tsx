import { Card, CardContent } from "@/components/ui/card";

export default function CtsoPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">CTSO Matchmaker</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          HOSA/DECA/TSA event directory, study guides, and rubric checklists (Module 5) — wired
          up in Phase 3.
        </CardContent>
      </Card>
    </div>
  );
}
