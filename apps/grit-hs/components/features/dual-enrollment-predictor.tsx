"use client";

import { useState } from "react";
import { Info, ExternalLink, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerifiedSystem {
  state: string;
  name: string;
  org: string;
  url: string;
  description: string;
  caveat?: string;
}

const VERIFIED_SYSTEMS: VerifiedSystem[] = [
  {
    state: "California",
    name: "ASSIST",
    org: "California Community Colleges, CSU, and UC systems",
    url: "https://assist.org",
    description:
      "The official, statewide course-to-course articulation system for every California Community College transferring into any CSU or UC campus. Search your community college and target campus/major directly.",
    caveat:
      "The public website is real and free to search yourself. Its newer developer API is still mid-rollout to approved subscribers as of early 2026, so this app can't query it automatically yet — search it directly instead.",
  },
  {
    state: "Texas",
    name: "TCCNS (Texas Common Course Numbering System)",
    org: "Texas Higher Education Coordinating Board",
    url: "https://tccns.org",
    description:
      "A shared course-numbering system used by Texas public colleges and universities — courses sharing a TCCNS number are recognized as equivalent for transfer purposes across participating institutions.",
  },
];

export function DualEnrollmentPredictor() {
  const [state, setState] = useState("");
  const match = VERIFIED_SYSTEMS.find((s) => s.state.toLowerCase() === state.trim().toLowerCase());

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Whether a dual-enrollment or AP/IB credit actually transfers is decided by each receiving
          university, not by any single national database. Two states — California and Texas — publish
          a real, official, searchable system covering this. Everywhere else, this app won&apos;t
          fabricate a mapping it can&apos;t verify; it points you to your target school&apos;s own
          transfer-credit office instead.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check your state</CardTitle>
          <CardDescription>Type your state to see if it has a verified system.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">Your state</span>
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. California, Texas, Ohio…"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {state.trim() && (
            <div>
              {match ? (
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Verified system found</Badge>
                    </div>
                    <p className="font-display text-lg font-bold">{match.name}</p>
                    <p className="text-sm text-muted-foreground">{match.org}</p>
                    <p className="text-sm text-muted-foreground">{match.description}</p>
                    {match.caveat && (
                      <p className="text-xs text-muted-foreground italic">{match.caveat}</p>
                    )}
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Search {match.name}
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-locked/50 bg-locked/10">
                  <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
                    <Search className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    No independently-verified statewide database found for {state.trim()} yet. Contact
                    your target university&apos;s registrar or transfer-credit office directly — ask
                    specifically whether they have a published course equivalency table, since many
                    schools do even without a statewide system.
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verified systems, in full</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {VERIFIED_SYSTEMS.map((s) => (
            <div key={s.state} className="rounded-md border border-border p-4">
              <p className="font-display font-bold">
                {s.state} — {s.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline"
              >
                <ExternalLink className="h-3.5 w-3.5" /> {s.url}
              </a>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
