"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, ChevronRight, Eraser, ScanLine, Info } from "lucide-react";
import { PanelCardShell } from "./panel-card-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { HoursHeatmap } from "@/components/features/hours-heatmap";
import { cn } from "@/lib/utils";
import { celebrate } from "@/lib/panel/celebrate";
import { bangers } from "@/app/fonts";
import { HoursMonolith } from "./hours-monolith";

const PANEL_INPUT =
  "border-panel-border/40 bg-panel/60 text-panel-foreground placeholder:text-panel-muted focus-visible:ring-panel-accent";

type HoursCategory = "clinical" | "volunteer" | "shadowing";

const CATEGORY_LABEL: Record<HoursCategory, string> = {
  clinical: "Clinical",
  volunteer: "Volunteer",
  shadowing: "Shadowing",
};

interface HoursEntry {
  id: string;
  category: HoursCategory;
  supervisor_name: string;
  hours: number;
  date: string;
  notes: string | null;
  signatureUrl: string | null;
  scannedDocUrl: string | null;
}

interface ScanExtraction {
  supervisorName: string | null;
  hours: number | null;
  date: string | null;
  notes: string | null;
}

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
      <span className="text-sm font-medium text-panel-muted">Supervisor signature</span>
      <canvas
        ref={canvasRef}
        width={280}
        height={90}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="touch-none rounded-md border border-panel-border/40 bg-white"
      />
      <Button type="button" size="sm" variant="ghost" onClick={clear} className="w-fit gap-2 text-panel-muted hover:text-panel-foreground">
        <Eraser className="h-3.5 w-3.5" aria-hidden="true" /> Clear
      </Button>
    </div>
  );
}

interface HoursCardProps {
  mode: "summary" | "detail";
  onExpand?: () => void;
}

export function HoursCard({ mode, onExpand }: HoursCardProps) {
  const [entries, setEntries] = useState<HoursEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<HoursCategory>("volunteer");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [hours, setHours] = useState("2");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedDocPath, setScannedDocPath] = useState<string | null>(null);
  const [scanExtracted, setScanExtracted] = useState<ScanExtraction | null>(null);

  useEffect(() => {
    fetch("/api/hours")
      .then((res) => (res.ok ? res.json() : { entries: [] }))
      .then((body) => setEntries(body.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalHours = entries.reduce((sum, e) => sum + Number(e.hours), 0);

  async function handleScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setScanError(null);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch("/api/hours/scan", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) {
        setScanError(body.error ?? "Couldn't read that form.");
        return;
      }
      setScannedDocPath(body.scannedDocPath);
      setScanExtracted(body.extracted);
      if (body.extracted?.supervisorName) setSupervisorName(body.extracted.supervisorName);
      if (body.extracted?.hours) setHours(String(body.extracted.hours));
      if (body.extracted?.date) setDate(body.extracted.date);
      if (body.extracted?.notes) setNotes(body.extracted.notes);
    } catch {
      setScanError("Couldn't reach the scan service.");
    } finally {
      setScanning(false);
      e.target.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supervisorName || !date) return;
    setSaving(true);
    setNotice(null);

    try {
      let signaturePath: string | undefined;
      if (signatureDataUrl) {
        const blob = await (await fetch(signatureDataUrl)).blob();
        const sigForm = new FormData();
        sigForm.append("signature", blob, "signature.png");
        const sigRes = await fetch("/api/hours/signature", { method: "POST", body: sigForm });
        if (sigRes.ok) {
          const sigBody = await sigRes.json();
          signaturePath = sigBody.signaturePath;
        }
      }

      const res = await fetch("/api/hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          supervisorName,
          supervisorEmail: supervisorEmail || undefined,
          hours: Number(hours) || 0,
          date,
          notes: notes || undefined,
          signaturePath,
          scannedDocPath: scannedDocPath ?? undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setNotice(body.error ?? "Couldn't save this entry.");
        return;
      }

      const refetch = await fetch("/api/hours");
      if (refetch.ok) setEntries((await refetch.json()).entries ?? []);

      celebrate();
      setSupervisorName("");
      setSupervisorEmail("");
      setHours("2");
      setDate("");
      setNotes("");
      setSignatureDataUrl(null);
      setScannedDocPath(null);
      setScanExtracted(null);
    } finally {
      setSaving(false);
    }
  }

  if (mode === "summary") {
    return (
      <PanelCardShell className="cursor-pointer" onClick={onExpand}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-panel-highlight">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span className="font-interface text-xs font-semibold uppercase tracking-wide">Volunteer Hours</span>
          </div>
          <ChevronRight className="h-4 w-4 text-panel-muted" aria-hidden="true" />
        </div>
        <p className={cn(bangers.className, "mt-3 text-3xl")}>{loading ? "…" : totalHours}h</p>
        <p className="font-interface text-sm text-panel-muted">logged total</p>
      </PanelCardShell>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-panel-border/30 bg-panel/40">
        <HoursMonolith totalHours={totalHours} />
        <div className="border-t border-panel-border/20 px-4 py-2 text-center">
          <p className={cn(bangers.className, "text-2xl text-panel-foreground")}>{totalHours}h logged</p>
          <p className="font-interface text-xs text-panel-muted">
            {totalHours < 60 ? `${(60 - totalHours).toFixed(1)}h to gold` : "Gold tier reached"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-panel-border/30 bg-panel/40 p-4">
        <p className="font-interface text-sm text-panel-muted">Activity, last 12 weeks</p>
        <HoursHeatmap entries={entries.map((e) => ({ date: e.date, hours: Number(e.hours) }))} />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg border border-panel-border/30 bg-panel/40 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-panel-muted">New entry</span>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-full bg-panel-accent/20 px-3 py-1 text-xs font-semibold text-panel-accent hover:bg-panel-accent/30">
            <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
            {scanning ? "Reading…" : "Scan a signed form"}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleScan} disabled={scanning} />
          </label>
        </div>

        {scanError && <p className="text-xs text-destructive">{scanError}</p>}
        {scanExtracted && (
          <div className="flex items-start gap-2 rounded-md border border-panel-accent/30 bg-panel-accent/10 p-2 text-xs text-panel-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-panel-accent" aria-hidden="true" />
            Fields below were read from your scan — review and correct anything before saving.
          </div>
        )}

        <Select dark value={category} onChange={(e) => setCategory(e.target.value as HoursCategory)}>
          {(Object.keys(CATEGORY_LABEL) as HoursCategory[]).map((c) => (
            <option key={c} value={c} className="bg-panel text-panel-foreground">
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </Select>
        <Input
          value={supervisorName}
          onChange={(e) => setSupervisorName(e.target.value)}
          placeholder="Supervisor name"
          required
          className={PANEL_INPUT}
        />
        <Input
          type="email"
          value={supervisorEmail}
          onChange={(e) => setSupervisorEmail(e.target.value)}
          placeholder="Supervisor email (optional)"
          className={PANEL_INPUT}
        />
        <div className="flex flex-col gap-1.5 rounded-md border border-panel-border/30 bg-panel/50 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="font-interface text-xs uppercase tracking-wide text-panel-muted">Hours</span>
            <span className={cn(bangers.className, "text-lg text-panel-accent")}>{hours}</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-panel accent-panel-accent"
          />
        </div>
        <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={PANEL_INPUT} />
        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className={PANEL_INPUT} />

        <SignaturePad onChange={setSignatureDataUrl} />

        {notice && <p className="text-sm text-panel-muted">{notice}</p>}
        <Button type="submit" disabled={saving || !supervisorName || !date} variant="accent" size="sm" className="self-end">
          Log hours
        </Button>
      </form>

      <div className="flex flex-col gap-2">
        {loading && <p className="text-sm text-panel-muted">Loading…</p>}
        {!loading && entries.length === 0 && (
          <p className="text-sm text-panel-muted">No hours logged yet — add your first entry above.</p>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start justify-between gap-3 rounded-lg border border-panel-border/30 bg-panel/40 p-3">
            <div>
              <p className="font-semibold text-panel-foreground">
                {entry.supervisor_name} · {entry.hours}h · {entry.date}
              </p>
              <p className="text-sm text-panel-muted">
                {CATEGORY_LABEL[entry.category]}
                {entry.notes ? ` — ${entry.notes}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {entry.signatureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={entry.signatureUrl} alt="Supervisor signature" className="h-8 w-20 rounded border border-panel-border/40 bg-white object-contain" />
              ) : (
                <span className="rounded-full bg-panel/60 px-2 py-0.5 text-xs text-panel-muted">Unsigned</span>
              )}
              {entry.scannedDocUrl && (
                <a href={entry.scannedDocUrl} target="_blank" rel="noreferrer" className="text-xs text-panel-accent underline">
                  Scan
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
