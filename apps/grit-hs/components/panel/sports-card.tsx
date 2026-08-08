"use client";

import { useEffect, useState } from "react";
import { Trophy, Plus, ChevronRight } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { SportsDeck } from "./sports-deck";
import { celebrate } from "@/lib/panel/celebrate";
import { SPORT_XP_AWARD } from "@/lib/constants";
import { useXpSync } from "@/lib/hooks/use-xp-sync";
import { CatalogCombobox } from "./catalog-combobox";
import { searchSports, findSport } from "@/lib/catalog/sports";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

interface SportRow {
  id: string;
  name: string;
  season: string | null;
  role: string | null;
  practice_schedule: string | null;
  coach_name: string | null;
  notes: string | null;
}

interface SportsCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

export function SportsCard({ mode, onExpand }: SportsCardProps) {
  const [sports, setSports] = useState<SportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [role, setRole] = useState("");
  const [practiceSchedule, setPracticeSchedule] = useState("");
  const [coachName, setCoachName] = useState("");
  const [saving, setSaving] = useState(false);
  const syncXp = useXpSync();

  useEffect(() => {
    fetch("/api/sports")
      .then((res) => (res.ok ? res.json() : { sports: [] }))
      .then((body) => setSports(body.sports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addSport(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          season: season || undefined,
          role: role || undefined,
          practiceSchedule: practiceSchedule || undefined,
          coachName: coachName || undefined,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setSports((prev) => [...prev, body.sport]);
        syncXp();
        if (typeof body.xpAwarded === "number" && body.xpAwarded > SPORT_XP_AWARD) celebrate();
        setName("");
        setSeason("");
        setRole("");
        setPracticeSchedule("");
        setCoachName("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeSport(id: string) {
    setSports((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/sports/${id}`, { method: "DELETE" }).catch(() => {});
    syncXp();
  }

  if (mode === "summary") {
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Sports</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        <p className={cn(bangers.className, "mt-3 text-3xl")}>{loading ? "…" : sports.length}</p>
        <p className="font-interface text-sm text-panel-muted">{sports.length === 1 ? "sport" : "sports"} tracked</p>
      </PanelCardShell>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!loading && sports.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="font-interface text-xs uppercase tracking-wide text-panel-muted">
            Scroll the deck to fan the cards
          </p>
          <SportsDeck sports={sports} onRemove={removeSport} />
        </div>
      )}

      <form
        onSubmit={addSport}
        className="flex flex-col gap-2 rounded-lg border border-panel-border/30 bg-panel/40 p-4"
      >
        <CatalogCombobox
          value={name}
          onChange={setName}
          onSelect={(picked) => {
            const known = findSport(picked);
            if (known && !season.trim()) setSeason(known.season);
          }}
          search={searchSports}
          placeholder="Sport name — start typing to search"
          className={PANEL_INPUT}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            placeholder="Season (e.g. Fall)"
            className={PANEL_INPUT}
          />
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your role (e.g. Captain)"
            className={PANEL_INPUT}
          />
        </div>
        <Input
          value={coachName}
          onChange={(e) => setCoachName(e.target.value)}
          placeholder="Coach name"
          className={PANEL_INPUT}
        />
        <Input
          value={practiceSchedule}
          onChange={(e) => setPracticeSchedule(e.target.value)}
          placeholder="Practice schedule"
          className={PANEL_INPUT}
        />
        <Button type="submit" disabled={saving || !name.trim()} variant="accent" size="sm" className="self-end">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add sport
        </Button>
      </form>

      {loading && <p className="font-interface text-sm text-panel-muted">Loading…</p>}
      {!loading && sports.length === 0 && (
        <p className="font-interface text-sm text-panel-muted">No sports yet — add your first one above.</p>
      )}
    </div>
  );
}
