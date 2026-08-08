"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CAREER_TRACKS, CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS, type CareerTrack } from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { MOCK_STUDENT } from "@/lib/mock-data";

const ALL_EVENTS = CAREER_TRACKS.flatMap((track) =>
  getRoadmapTemplate(track)
    .milestones.filter((m) => m.category === "ctso")
    .map((m) => ({ ...m, track }))
);

function SpeechTimer() {
  const [durationSec, setDurationSec] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => (r <= 0 ? 0 : r - 1));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const pct = (remaining / durationSec) * 100;
  const color = pct > 50 ? "text-primary" : pct > 20 ? "text-accent" : "text-destructive";
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Speech / Prepared Presentation Timer
        </p>
        <p className={`font-display text-6xl font-bold tabular-nums ${color}`}>
          {mins}:{secs.toString().padStart(2, "0")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[180, 300, 480, 600].map((d) => (
            <button
              key={d}
              onClick={() => {
                setDurationSec(d);
                setRemaining(d);
                setRunning(false);
              }}
              className={
                "rounded-full px-3 py-1 text-sm transition-colors " +
                (d === durationSec ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")
              }
            >
              {d / 60} min
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setRunning((r) => !r)} className="gap-2" disabled={remaining === 0}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setRemaining(durationSec);
              setRunning(false);
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CtsoStrategyEngine() {
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile);
  const myTrack = isReal ? data!.profile!.target_career ?? MOCK_STUDENT.targetCareer : MOCK_STUDENT.targetCareer;

  const [trackFilter, setTrackFilter] = useState<CareerTrack | "all">("all");
  const [query, setQuery] = useState("");
  const autoSet = useRef(false);

  // Default the filter to the student's own track the first time it's known,
  // without fighting a manual selection they make afterward.
  useEffect(() => {
    if (!autoSet.current && myTrack) {
      setTrackFilter(myTrack);
      autoSet.current = true;
    }
  }, [myTrack]);

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((e) => {
      if (trackFilter !== "all" && e.track !== trackFilter) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    });
  }, [trackFilter, query]);

  return (
    <div className="flex flex-col gap-6">
      <SpeechTimer />

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events (Mock Trial, Financial Consulting, Robotics...)"
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm outline-none"
          />
          <Select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value as CareerTrack | "all")}
            className="w-auto rounded-full pr-8"
          >
            <option value="all">All tracks</option>
            {CAREER_TRACKS.map((t) => (
              <option key={t} value={t}>
                {CAREER_TRACK_LABELS[t]}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{filtered.length} competitive events</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((event) => (
          <Card key={`${event.track}-${event.gradeLevel}-${event.title}`}>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                <Badge variant="outline">{GRADE_LEVEL_LABELS[event.gradeLevel]}</Badge>
                <Badge variant="accent">{CAREER_TRACK_LABELS[event.track]}</Badge>
              </div>
              <p className="font-display text-lg font-bold leading-snug">{event.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
