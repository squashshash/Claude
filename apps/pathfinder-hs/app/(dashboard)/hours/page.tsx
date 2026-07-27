import { Card, CardContent } from "@/components/ui/card";

export default function HoursPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Hours Logger</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Clinical/volunteer/shadowing hours logbook and supervisor verification (Module 4) —
          wired up in Phase 3 against the <code>hours_logged</code> table.
        </CardContent>
      </Card>
    </div>
  );
}
