"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, ChevronRight } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bangers } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { ClassTimeMatrix } from "./class-time-matrix";
import { CatalogCombobox } from "./catalog-combobox";
import { searchCourses } from "@/lib/catalog/courses";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

interface ClassRow {
  id: string;
  course_name: string;
  days_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  teacher_name: string | null;
}

interface ScheduleCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

export function ScheduleCard({ mode, onExpand }: ScheduleCardProps) {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/class-schedule")
      .then((res) => (res.ok ? res.json() : { classes: [] }))
      .then((body) => setClasses(body.classes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addClass(e: React.FormEvent) {
    e.preventDefault();
    if (!courseName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/class-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseName,
          daysOfWeek: daysOfWeek || undefined,
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          room: room || undefined,
          teacherName: teacherName || undefined,
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setClasses((prev) => [...prev, body.class]);
        setCourseName("");
        setDaysOfWeek("");
        setStartTime("");
        setEndTime("");
        setRoom("");
        setTeacherName("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeClass(id: string) {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/class-schedule/${id}`, { method: "DELETE" }).catch(() => {});
  }

  if (mode === "summary") {
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Class Schedule</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        <p className={cn(bangers.className, "mt-3 text-3xl")}>{loading ? "…" : classes.length}</p>
        <p className="font-interface text-sm text-panel-muted">{classes.length === 1 ? "class" : "classes"} on file</p>
      </PanelCardShell>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!loading && classes.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="font-interface text-xs uppercase tracking-wide text-panel-muted">
            Click a period to split it open
          </p>
          <ClassTimeMatrix classes={classes} onRemove={removeClass} />
        </div>
      )}

      <form
        onSubmit={addClass}
        className="flex flex-col gap-2 rounded-lg border border-panel-border/30 bg-panel/40 p-4"
      >
        <CatalogCombobox
          value={courseName}
          onChange={setCourseName}
          search={searchCourses}
          placeholder="Course name — start typing to search"
          className={PANEL_INPUT}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={daysOfWeek}
            onChange={(e) => setDaysOfWeek(e.target.value)}
            placeholder="Days (e.g. MWF)"
            className={PANEL_INPUT}
          />
          <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room" className={PANEL_INPUT} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={PANEL_INPUT} />
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={PANEL_INPUT} />
        </div>
        <Input
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          placeholder="Teacher name"
          className={PANEL_INPUT}
        />
        <Button type="submit" disabled={saving || !courseName.trim()} variant="accent" size="sm" className="self-end">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add class
        </Button>
      </form>

      {loading && <p className="font-interface text-sm text-panel-muted">Loading…</p>}
      {!loading && classes.length === 0 && (
        <p className="font-interface text-sm text-panel-muted">No classes yet — add your first period above.</p>
      )}
    </div>
  );
}
