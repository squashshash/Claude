"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Info, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PublicHandle() {
  const [isReal, setIsReal] = useState(false);
  const [handle, setHandle] = useState("");
  const [portfolioPublic, setPortfolioPublic] = useState(false);
  const [savedHandle, setSavedHandle] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body) return;
        setIsReal(true);
        setSavedHandle(body.handle);
        setHandle(body.handle ?? "");
        setPortfolioPublic(body.portfolioPublic);
      })
      .catch(() => {});
  }, []);

  const save = async (makePublic: boolean) => {
    setSaving(true);
    setNotice(null);
    if (!isReal) {
      setNotice("Not connected to a real account here — nothing to save in this session.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.toLowerCase(), portfolioPublic: makePublic }),
      });
      const body = await res.json();
      if (!res.ok) {
        setNotice(body.error ?? "Couldn't save.");
        setSaving(false);
        return;
      }
      setSavedHandle(body.handle);
      setPortfolioPublic(body.portfolioPublic);
      setNotice(makePublic ? "Your portfolio is live." : "Your portfolio is now private.");
    } catch {
      setNotice("Couldn't reach the server.");
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          A public, read-only page at <span className="font-mono">/p/your-handle</span> showing your
          name, track, XP, completed milestones, and any credentials you&apos;ve marked public in the
          Credential Vault. Off by default — nothing is shared until you turn it on.
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
        {portfolioPublic && savedHandle && (
          <Badge variant="accent">
            <Link2 className="mr-1 h-3 w-3" /> Live at /p/{savedHandle}
          </Badge>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Handle</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">grit.app/p/</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="jordan-a"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </div>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="sm"
              onClick={() => save(true)}
              disabled={saving || !handle || handle.length < 3}
              className="gap-2"
            >
              {portfolioPublic ? "Update public page" : "Make my portfolio public"}
            </Button>
            {portfolioPublic && (
              <Button size="sm" variant="outline" onClick={() => save(false)} disabled={saving}>
                Make private
              </Button>
            )}
            {portfolioPublic && savedHandle && (
              <Button size="sm" variant="ghost" className="gap-2" asChild>
                <a href={`/p/${savedHandle}`} target="_blank" rel="noreferrer">
                  View your page <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>

          {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
