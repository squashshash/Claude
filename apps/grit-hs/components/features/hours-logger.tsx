"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eraser, Stethoscope, HeartHandshake, Users, Info, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoursHeatmap } from "./hours-heatmap";

type HoursCategory = "clinical" | "volunteer" | "shadowing";

interface HoursEntry {
  id: string;
  category: HoursCategory;
  supervisorName: string;
  hours: number;
  date: string;
  notes: string;
  signature: string | null;
}

const CATEGORY_META: Record<HoursCategory, { label: string; icon: typeof Stethoscope }> = {
  clinical: { label: "Clinical", icon: Stethoscope },
  volunteer: { label: "Volunteer", icon: HeartHandshake },
  shadowing: { label: "Shadowing", icon: Users },
};

function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    const { x, y } = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineTo(x, y);
    ctx.stroke();
    hasInk.current = true;
  };

  const end = () => {
    drawing.current = false;
    if (hasInk.current && canvasRef.current) onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">Supervisor signature</span>
      <canvas
        ref={canvasRef}
        width={320}
        height={100}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="touch-none rounded-md border border-input bg-white"
      />
      <Button type="button" size="sm" variant="ghost" onClick={clear} className="w-fit gap-2">
        <Eraser className="h-3.5 w-3.5" /> Clear
      </Button>
    </div>
  );
}

const DEFAULT_ENTRIES: HoursEntry[] = [
  {
    id: "seed-1",
    category: "shadowing",
    supervisorName: "Dr. Patel",
    hours: 4,
    date: "2026-06-12",
    notes: "Primary care shadowing, morning rounds",
    signature: null,
  },
];

interface DbHoursRow {
  id: string;
  category: HoursCategory;
  supervisor_name: string;
  hours: number;
  date: string;
  notes: string | null;
}

export function HoursLogger() {
  const [entries, setEntries] = useState<HoursEntry[]>(DEFAULT_ENTRIES);
  const [isReal, setIsReal] = useState(false);
  const [category, setCategory] = useState<HoursCategory>("clinical");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [hours, setHours] = useState("2");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hours")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body?.entries) return;
        setEntries(
          (body.entries as DbHoursRow[]).map((row) => ({
            id: row.id,
            category: row.category,
            supervisorName: row.supervisor_name,
            hours: Number(row.hours),
            date: row.date,
            notes: row.notes ?? "",
            signature: null,
          }))
        );
        setIsReal(true);
      })
      .catch(() => {
        // No project configured / not authenticated — stick with the local demo entries.
      });
  }, []);

  const totals = entries.reduce<Record<HoursCategory, number>>(
    (acc, e) => {
      acc[e.category] += e.hours;
      return acc;
    },
    { clinical: 0, volunteer: 0, shadowing: 0 }
  );

  const resetForm = () => {
    setSupervisorName("");
    setSupervisorEmail("");
    setHours("2");
    setDate("");
    setNotes("");
    setSignature(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorName || !date) return;
    setNotice(null);

    const localEntry: HoursEntry = {
      id: crypto.randomUUID(),
      category,
      supervisorName,
      hours: Number(hours) || 0,
      date,
      notes,
      signature,
    };

    if (isReal) {
      try {
        const res = await fetch("/api/hours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            supervisorName,
            supervisorEmail,
            hours: Number(hours) || 0,
            date,
            notes,
          }),
        });
        const body = await res.json();
        if (!res.ok) {
          setNotice(body.error ?? "Couldn't save to your account — kept locally instead.");
          setEntries((prev) => [localEntry, ...prev]);
        } else {
          const row: DbHoursRow = body.entry;
          setEntries((prev) => [
            {
              id: row.id,
              category: row.category,
              supervisorName: row.supervisor_name,
              hours: Number(row.hours),
              date: row.date,
              notes: row.notes ?? "",
              signature, // kept for this session only — not persisted (no column for it yet)
            },
            ...prev,
          ]);
        }
      } catch {
        setNotice("Couldn't reach the server — kept locally instead.");
        setEntries((prev) => [localEntry, ...prev]);
      }
    } else {
      setEntries((prev) => [localEntry, ...prev]);
    }

    resetForm();
  };

  const grandTotal = totals.clinical + totals.volunteer + totals.shadowing;

  return (
    <div className="flex flex-col gap-6">
      {/* Print-only summary — everything else below is print:hidden */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">Hours Summary</h1>
        <p className="mt-1 text-sm">
          Clinical: {totals.clinical}h &middot; Volunteer: {totals.volunteer}h &middot; Shadowing:{" "}
          {totals.shadowing}h &middot; Total: {grandTotal}h
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black text-left">
              <th className="py-1 pr-4">Date</th>
              <th className="py-1 pr-4">Category</th>
              <th className="py-1 pr-4">Supervisor</th>
              <th className="py-1 pr-4">Hours</th>
              <th className="py-1">Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-black/20">
                <td className="py-1 pr-4">{entry.date}</td>
                <td className="py-1 pr-4">{CATEGORY_META[entry.category].label}</td>
                <td className="py-1 pr-4">{entry.supervisorName}</td>
                <td className="py-1 pr-4">{entry.hours}</td>
                <td className="py-1">{entry.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="print:hidden">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          {isReal
            ? "Signed in — new entries save to your account. The signature capture is session-only for now; there's no column to persist it to yet."
            : "Not connected to a real account here, so entries are local to this browser session."}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 print:hidden">
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
        <Button size="sm" variant="outline" className="gap-2" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 print:hidden">
        {(Object.keys(CATEGORY_META) as HoursCategory[]).map((c) => {
          const { label, icon: Icon } = CATEGORY_META[c];
          return (
            <Card key={c}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" /> {label}
                </CardDescription>
                <CardTitle className="text-3xl">{totals[c]}h</CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Darker squares mean more hours logged that day.</CardDescription>
        </CardHeader>
        <CardContent>
          <HoursHeatmap entries={entries.map((e) => ({ date: e.date, hours: e.hours }))} />
        </CardContent>
      </Card>

      <Card className="print:hidden">
        <CardContent className="p-5">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HoursCategory)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {(Object.keys(CATEGORY_META) as HoursCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Supervisor name</span>
              <input
                required
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Supervisor email</span>
              <input
                type="email"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Hours</span>
              <input
                type="number"
                min={0}
                step={0.5}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Date</span>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium text-muted-foreground">Notes</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <div className="sm:col-span-2">
              <SignaturePad onChange={setSignature} />
            </div>
            {notice && <p className="text-sm text-muted-foreground sm:col-span-2">{notice}</p>}
            <Button type="submit" className="w-fit gap-2 sm:col-span-2">
              Log hours
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 print:hidden">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const Icon = CATEGORY_META[entry.category].icon;
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {entry.supervisorName} &middot; {entry.hours}h &middot; {entry.date}
                        </p>
                        <p className="text-sm text-muted-foreground">{entry.notes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{CATEGORY_META[entry.category].label}</Badge>
                      {entry.signature ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.signature}
                          alt="Supervisor signature"
                          className="h-8 w-24 rounded border border-border bg-background object-contain"
                        />
                      ) : (
                        <Badge variant="locked">Unsigned</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
