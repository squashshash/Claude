"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Plus, Trash2, ChevronRight, X } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Schedule3DTimeline } from "./schedule-3d-timeline";
import { ExamCountdownRing } from "./exam-countdown-ring";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { celebrate } from "@/lib/panel/celebrate";
import { EXAM_OK_SCORE_THRESHOLD } from "@/lib/constants";
import { useXpSync } from "@/lib/hooks/use-xp-sync";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

const EXAM_TYPES = ["ap", "sat", "act", "final", "midterm", "certification", "other"] as const;
type ExamType = (typeof EXAM_TYPES)[number];
type ExamStatus = "upcoming" | "registered" | "completed";

interface ExamRow {
  id: string;
  title: string;
  exam_type: ExamType;
  date: string;
  registration_deadline: string | null;
  location: string | null;
  status: ExamStatus;
  notes: string | null;
  score: number | null;
}

interface ExamsCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

function countdownParts(dateStr: string) {
  const target = new Date(`${dateStr}T00:00:00`);
  const diffMs = target.getTime() - Date.now();
  const abs = Math.max(0, diffMs);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  return { days, hours, minutes, past: diffMs < 0 };
}

export function ExamsCard({ mode, onExpand }: ExamsCardProps) {
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState<ExamType>("other");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [scoreDraft, setScoreDraft] = useState("");
  const syncXp = useXpSync();

  useEffect(() => {
    fetch("/api/exams")
      .then((res) => (res.ok ? res.json() : { exams: [] }))
      .then((body) => setExams(body.exams ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = useMemo(
    () => exams.filter((e) => e.status !== "completed").sort((a, b) => a.date.localeCompare(b.date)),
    [exams]
  );

  const selected = exams.find((e) => e.id === selectedId) ?? null;

  async function addExam(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSaving(true);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, examType, date, location: location || undefined }),
      });
      if (res.ok) {
        const body = await res.json();
        setExams((prev) => [...prev, body.exam]);
        setTitle("");
        setDate("");
        setLocation("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeExam(id: string) {
    setExams((prev) => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
    await fetch(`/api/exams/${id}`, { method: "DELETE" }).catch(() => {});
    syncXp();
  }

  async function cycleStatus(exam: ExamRow) {
    const next: ExamStatus =
      exam.status === "upcoming" ? "registered" : exam.status === "registered" ? "completed" : "upcoming";
    setExams((prev) => prev.map((e) => (e.id === exam.id ? { ...e, status: next } : e)));
    await fetch(`/api/exams/${exam.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).catch(() => {});
  }

  async function saveNotes(id: string, notes: string) {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, notes } : e)));
    await fetch(`/api/exams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).catch(() => {});
  }

  async function saveScore(id: string, rawScore: string) {
    const score = rawScore.trim() === "" ? null : Number(rawScore);
    if (score !== null && (Number.isNaN(score) || score < 0 || score > 100)) return;
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, score } : e)));
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      });
      const body = await res.json();
      syncXp();
      if (res.ok && typeof body.xpAwarded === "number" && body.xpAwarded > 0) celebrate();
    } catch {
      // best-effort — local state already reflects the edit
    }
  }

  if (mode === "summary") {
    const next = upcoming[0];
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Exam Deadlines</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        {loading ? (
          <p className={cn(bangers.className, "mt-3 text-2xl")}>…</p>
        ) : next ? (
          <>
            <p className={cn(bangers.className, "mt-3 truncate text-xl")}>{next.title}</p>
            <p className="font-interface text-sm text-panel-muted">{next.date}</p>
          </>
        ) : (
          <p className="font-interface text-sm text-panel-muted">No upcoming exams</p>
        )}
      </PanelCardShell>
    );
  }

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-interface text-xs font-semibold uppercase tracking-wide text-panel-muted">
          Mission control — drag to look down the timeline
        </p>
        <Schedule3DTimeline
          items={exams.map((e) => ({ id: e.id, label: e.title, date: e.date, kind: "exam" as const }))}
        />
      </div>

      {!loading && exams.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 rounded-lg border border-panel-border/30 bg-panel/30 p-3">
          {exams
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((exam) => (
              <ExamCountdownRing
                key={exam.id}
                title={exam.title}
                date={exam.date}
                onClick={() => {
                  setSelectedId(exam.id);
                  setNotesDraft(exam.notes ?? "");
                  setScoreDraft(exam.score === null ? "" : String(exam.score));
                }}
              />
            ))}
        </div>
      )}

      <form
        onSubmit={addExam}
        className="flex flex-col gap-2 rounded-lg border border-panel-border/30 bg-panel/40 p-4"
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exam title (e.g. AP Biology)" className={PANEL_INPUT} />
        <div className="grid grid-cols-2 gap-2">
          <Select dark value={examType} onChange={(e) => setExamType(e.target.value as ExamType)}>
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t} className="bg-panel text-panel-foreground">
                {t.toUpperCase()}
              </option>
            ))}
          </Select>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={PANEL_INPUT} />
        </div>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className={PANEL_INPUT}
        />
        <Button type="submit" disabled={saving || !title.trim() || !date} variant="accent" size="sm" className="self-end">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add exam
        </Button>
      </form>

      {loading && <p className="font-interface text-sm text-panel-muted">Loading…</p>}
      {!loading && exams.length === 0 && (
        <p className="font-interface text-sm text-panel-muted">No exams yet — add your first deadline above.</p>
      )}

      {/* zoomed split-detail view — a "camera zoom" into the clicked ring */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="absolute inset-0 z-10 flex flex-col gap-3 overflow-y-auto rounded-lg border border-panel-accent/40 bg-panel/95 p-4 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between">
              <p className={cn(bangers.className, "text-2xl text-panel-foreground")}>{selected.title}</p>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-full p-1.5 text-panel-muted hover:bg-panel-card hover:text-panel-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {(() => {
              const parts = countdownParts(selected.date);
              return (
                <div className="flex items-baseline justify-center gap-4 rounded-lg border border-panel-border/30 bg-panel/40 py-4">
                  {[
                    [parts.days, "days"],
                    [parts.hours, "hrs"],
                    [parts.minutes, "min"],
                  ].map(([value, unit]) => (
                    <div key={unit as string} className="flex flex-col items-center">
                      <span className={cn(bangers.className, "text-3xl text-panel-accent")}>{value}</span>
                      <span className="font-interface text-[10px] uppercase tracking-wide text-panel-muted">{unit}</span>
                    </div>
                  ))}
                  {parts.past && <span className="font-interface text-xs text-panel-muted">(already passed)</span>}
                </div>
              );
            })()}

            <p className="font-interface text-sm text-panel-muted">
              {selected.exam_type.toUpperCase()} · {selected.date}
              {selected.location ? ` · ${selected.location}` : ""}
            </p>

            <button
              type="button"
              onClick={() => cycleStatus(selected)}
              className="w-fit rounded-full bg-panel-accent/20 px-3 py-1 font-interface text-xs font-semibold uppercase tracking-wide text-panel-accent hover:bg-panel-accent/30"
            >
              {selected.status}
            </button>

            <div className="flex flex-col gap-1">
              <label htmlFor="exam-score" className="font-interface text-xs uppercase tracking-wide text-panel-muted">
                Your score (%) — real scores earn XP, {EXAM_OK_SCORE_THRESHOLD}+ and up
              </label>
              <Input
                id="exam-score"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={scoreDraft}
                onChange={(e) => setScoreDraft(e.target.value)}
                onBlur={() => saveScore(selected.id, scoreDraft)}
                placeholder="e.g. 92"
                className={PANEL_INPUT}
              />
            </div>

            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => saveNotes(selected.id, notesDraft)}
              placeholder="Quick-glance study checklist / notes…"
              rows={4}
              className={cn(PANEL_INPUT, "resize-none rounded-md px-3 py-2 text-sm")}
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeExam(selected.id)}
              className="w-fit gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove exam
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
