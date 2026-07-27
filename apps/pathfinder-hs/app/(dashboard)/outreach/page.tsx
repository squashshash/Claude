import { Card, CardContent } from "@/components/ui/card";

export default function OutreachPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Cold Outreach</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          AI-powered cold-email generator (Module 4) — wired up in Phase 3 via the Vercel AI SDK
          against <code>app/api/outreach/generate</code>.
        </CardContent>
      </Card>
    </div>
  );
}
