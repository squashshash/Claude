"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CareerTrackStep } from "@/components/onboarding/career-track-step";
import { YourData } from "@/components/settings/your-data";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { CAREER_TRACK_LABELS, type CareerTrack } from "@/lib/constants";

export default function SettingsPage() {
  const { data } = useDashboardData();
  const queryClient = useQueryClient();
  const isReal = Boolean(data?.authenticated && data.profile);
  const currentTrack = data?.profile?.target_career ?? undefined;

  const [changingPathway, setChangingPathway] = useState(false);
  const [selected, setSelected] = useState<CareerTrack | undefined>(currentTrack);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function savePathway() {
    if (!selected || selected === currentTrack) {
      setChangingPathway(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/pathway", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCareer: selected }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't switch pathways");
      }
      await queryClient.invalidateQueries({ queryKey: ["dashboard-state"] });
      setChangingPathway(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Your Pathway</CardTitle>
            <CardDescription>Switch tracks any time — your roadmap regenerates for the new one.</CardDescription>
          </div>
          <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!changingPathway ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                <span className="text-muted-foreground">Currently on:</span>{" "}
                <span className="font-semibold">
                  {currentTrack ? CAREER_TRACK_LABELS[currentTrack] : "No pathway selected yet"}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={!isReal}
                onClick={() => {
                  setSelected(currentTrack);
                  setChangingPathway(true);
                }}
              >
                {isReal ? "Change pathway" : "Log in to change pathway"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="rounded-md bg-muted/60 p-3 text-sm text-muted-foreground">
                Switching pathways replaces your current roadmap and milestones with a fresh set for the new
                track — your progress on the current one won&apos;t carry over, though your XP total is safe.
              </p>
              <CareerTrackStep value={selected} onChange={setSelected} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setChangingPathway(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="button" onClick={savePathway} disabled={saving || !selected}>
                  {saving ? "Switching..." : "Confirm switch"}
                </Button>
              </div>
            </div>
          )}
          {saved && <p className="text-sm font-medium text-primary">Pathway updated — your new roadmap is ready.</p>}
        </CardContent>
      </Card>

      <YourData enabled={isReal} />

      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          More account settings — profile details, notifications — coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
