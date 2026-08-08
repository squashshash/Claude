"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Trash2, ChevronRight, X } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { ClubsConstellation, type ClubCategory, type ConstellationClub } from "./clubs-constellation";
import { celebrate } from "@/lib/panel/celebrate";
import { CLUB_XP_AWARD } from "@/lib/constants";
import { useXpSync } from "@/lib/hooks/use-xp-sync";
import { CatalogCombobox } from "./catalog-combobox";
import { searchClubs, findClub } from "@/lib/catalog/clubs";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

const CATEGORIES: { value: ClubCategory; label: string }[] = [
  { value: "stem", label: "STEM" },
  { value: "arts", label: "Arts" },
  { value: "athletics", label: "Athletics" },
  { value: "service", label: "Service" },
  { value: "other", label: "Other" },
];

interface ClubRow {
  id: string;
  name: string;
  category: ClubCategory;
  role: string | null;
  meeting_schedule: string | null;
  advisor_name: string | null;
  joined_date: string | null;
  notes: string | null;
}

interface ClubsCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

export function ClubsCard({ mode, onExpand }: ClubsCardProps) {
  const [clubs, setClubs] = useState<ClubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClubCategory>("other");
  const [role, setRole] = useState("");
  const [meetingSchedule, setMeetingSchedule] = useState("");
  const [advisorName, setAdvisorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<ClubRow | null>(null);
  const syncXp = useXpSync();

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => (res.ok ? res.json() : { clubs: [] }))
      .then((body) => setClubs(body.clubs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addClub(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          role: role || undefined,
          meetingSchedule: meetingSchedule || undefined,
          advisorName: advisorName || undefined,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setClubs((prev) => [...prev, body.club]);
        syncXp();
        if (typeof body.xpAwarded === "number" && body.xpAwarded > CLUB_XP_AWARD) celebrate();
        setName("");
        setCategory("other");
        setRole("");
        setMeetingSchedule("");
        setAdvisorName("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeClub(id: string) {
    setClubs((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => (prev?.id === id ? null : prev));
    await fetch(`/api/clubs/${id}`, { method: "DELETE" }).catch(() => {});
    syncXp();
  }

  if (mode === "summary") {
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Clubs</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        <p className={cn(bangers.className, "mt-3 text-3xl")}>{loading ? "…" : clubs.length}</p>
        <p className="font-interface text-sm text-panel-muted">{clubs.length === 1 ? "club" : "clubs"} tracked</p>
      </PanelCardShell>
    );
  }

  const constellationClubs: ConstellationClub[] = clubs.map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    role: c.role,
    meeting_schedule: c.meeting_schedule,
  }));

  return (
    <div className="flex flex-col gap-4">
      {!loading && clubs.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="font-interface text-xs uppercase tracking-wide text-panel-muted">
            Drag your cursor across the map — click a station for details
          </p>
          <ClubsConstellation clubs={constellationClubs} onSelect={(c) => setSelected(clubs.find((r) => r.id === c.id) ?? null)} />
        </div>
      )}

      {selected && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-panel-accent/40 bg-panel-accent/10 p-3">
          <div>
            <p className={cn(bangers.className, "text-lg text-panel-foreground")}>{selected.name}</p>
            <p className="font-interface text-sm text-panel-muted">
              {CATEGORIES.find((c) => c.value === selected.category)?.label}
              {selected.role ? ` · ${selected.role}` : ""}
              {selected.advisor_name ? ` · Advisor: ${selected.advisor_name}` : ""}
            </p>
            {selected.meeting_schedule && <p className="text-xs text-panel-muted">{selected.meeting_schedule}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => removeClub(selected.id)}
              className="rounded-full p-1.5 text-panel-muted hover:bg-panel-card hover:text-destructive"
              aria-label={`Remove ${selected.name}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full p-1.5 text-panel-muted hover:bg-panel-card hover:text-panel-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={addClub}
        className="flex flex-col gap-2 rounded-lg border border-panel-border/30 bg-panel/40 p-4"
      >
        <CatalogCombobox
          value={name}
          onChange={setName}
          onSelect={(picked) => {
            const known = findClub(picked);
            if (known) setCategory(known.category);
          }}
          search={searchClubs}
          placeholder="Club name — start typing to search"
          className={PANEL_INPUT}
        />
        <div className="flex gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={cn(
                "flex-1 rounded-md py-1.5 font-interface text-xs font-semibold uppercase tracking-wide",
                category === c.value ? "bg-panel-accent text-panel" : "bg-panel/60 text-panel-muted"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Your role (e.g. Member)"
            className={PANEL_INPUT}
          />
          <Input
            value={advisorName}
            onChange={(e) => setAdvisorName(e.target.value)}
            placeholder="Advisor name"
            className={PANEL_INPUT}
          />
        </div>
        <Input
          value={meetingSchedule}
          onChange={(e) => setMeetingSchedule(e.target.value)}
          placeholder="Meeting schedule (e.g. Wednesdays 3:30pm, Rm 204)"
          className={PANEL_INPUT}
        />
        <Button type="submit" disabled={saving || !name.trim()} variant="accent" size="sm" className="self-end">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add club
        </Button>
      </form>

      {loading && <p className="font-interface text-sm text-panel-muted">Loading…</p>}
      {!loading && clubs.length === 0 && (
        <p className="font-interface text-sm text-panel-muted">No clubs yet — add your first one above.</p>
      )}
    </div>
  );
}
