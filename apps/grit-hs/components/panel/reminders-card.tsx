"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Plus, Trash2, ChevronRight, Check } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { celebrate } from "@/lib/panel/celebrate";
import { bangers } from "@/app/fonts";
import { RemindersGravityPool } from "./reminders-gravity-pool";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

const PRIORITIES = ["low", "medium", "high"] as const;
type Priority = (typeof PRIORITIES)[number];

interface ReminderRow {
  id: string;
  title: string;
  due_date: string;
  due_time: string | null;
  course: string | null;
  priority: Priority;
  completed: boolean;
  notes: string | null;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low: "bg-panel-muted/20 text-panel-muted",
  medium: "bg-panel-accent/20 text-panel-accent",
  high: "bg-destructive/20 text-destructive",
};

interface RemindersCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

export function RemindersCard({ mode, onExpand }: RemindersCardProps) {
  const [reminders, setReminders] = useState<ReminderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [course, setCourse] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/reminders")
      .then((res) => (res.ok ? res.json() : { reminders: [] }))
      .then((body) => setReminders(body.reminders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = useMemo(() => reminders.filter((r) => !r.completed), [reminders]);

  async function addReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dueDate, course: course || undefined, priority }),
      });
      if (res.ok) {
        const body = await res.json();
        setReminders((prev) => [...prev, body.reminder]);
        setTitle("");
        setDueDate("");
        setCourse("");
        setPriority("medium");
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleComplete(reminder: ReminderRow) {
    if (!reminder.completed) celebrate();
    setReminders((prev) =>
      prev.map((r) => (r.id === reminder.id ? { ...r, completed: !r.completed } : r))
    );
    await fetch(`/api/reminders/${reminder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !reminder.completed }),
    }).catch(() => {});
  }

  async function removeReminder(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/reminders/${id}`, { method: "DELETE" }).catch(() => {});
  }

  function completeFromPool(id: string) {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder && !reminder.completed) toggleComplete(reminder);
  }

  if (mode === "summary") {
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <BellRing className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Reminders</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        <p className={cn(bangers.className, "mt-3 text-3xl")}>{loading ? "…" : pending.length}</p>
        <p className="font-interface text-sm text-panel-muted">due</p>
      </PanelCardShell>
    );
  }

  const completed = reminders.filter((r) => r.completed);

  return (
    <div className="flex flex-col gap-4">
      {!loading && pending.length > 0 && (
        <RemindersGravityPool
          reminders={pending.map((r) => ({ id: r.id, title: r.title, priority: r.priority }))}
          onComplete={completeFromPool}
        />
      )}

      <form
        onSubmit={addReminder}
        className="flex flex-col gap-2 rounded-lg border border-panel-border/30 bg-panel/40 p-4"
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className={PANEL_INPUT} />
        <div className="grid grid-cols-2 gap-2">
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={PANEL_INPUT} />
          <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course (optional)" className={PANEL_INPUT} />
        </div>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "flex-1 rounded-md py-1.5 text-xs font-semibold uppercase tracking-wide",
                priority === p ? PRIORITY_COLOR[p] : "bg-panel/60 text-panel-muted"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <Button type="submit" disabled={saving || !title.trim() || !dueDate} variant="accent" size="sm" className="self-end">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add reminder
        </Button>
      </form>

      {loading && <p className="font-interface text-sm text-panel-muted">Loading…</p>}
      {!loading && reminders.length === 0 && (
        <p className="font-interface text-sm text-panel-muted">Nothing due — add your first reminder above.</p>
      )}

      {completed.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-interface text-xs uppercase tracking-wide text-panel-muted">Completed</p>
          {completed.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-panel-border/20 bg-panel/25 p-2.5 opacity-70"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleComplete(reminder)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-panel-accent bg-panel-accent text-panel"
                  aria-label="Mark incomplete"
                >
                  <Check className="h-3 w-3" aria-hidden="true" />
                </button>
                <p className="font-interface text-sm text-panel-foreground line-through">{reminder.title}</p>
              </div>
              <button
                type="button"
                onClick={() => removeReminder(reminder.id)}
                className="shrink-0 rounded-full p-1.5 text-panel-muted hover:bg-panel-card hover:text-destructive"
                aria-label={`Remove ${reminder.title}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
