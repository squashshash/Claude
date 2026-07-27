import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Profile, state/ZIP, and account settings — wired up in Phase 3 once auth lands.
        </CardContent>
      </Card>
    </div>
  );
}
