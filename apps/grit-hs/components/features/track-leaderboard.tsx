"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleDataBanner } from "./sample-data-banner";
import { CAREER_TRACK_LABELS } from "@/lib/constants";
import { MOCK_STUDENT } from "@/lib/mock-data";

const SAMPLE_PEERS = [
  { initials: "R.K.", xp: 9200, streak: 34, isYou: false },
  { initials: "J.A.", xp: 6250, streak: 12, isYou: false },
  { initials: "M.T.", xp: 5980, streak: 21, isYou: false },
  { initials: "S.O.", xp: 4400, streak: 6, isYou: false },
  { initials: "D.P.", xp: 3100, streak: 15, isYou: false },
];

interface LeaderboardEntry {
  handle: string;
  xp_points: number;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  you: { handle: string | null; isPublic: boolean; xpPoints: number } | null;
}

export function TrackLeaderboard() {
  const [real, setReal] = useState<LeaderboardResponse | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setReal(body))
      .catch(() => {});
  }, []);

  const isReal = Boolean(real?.you);

  if (isReal) {
    const you = real!.you!;
    const ranked = [
      ...real!.entries.map((e) => ({ handle: e.handle, xp: e.xp_points, isYou: e.handle === you.handle })),
      // Include "you" even if not opted in / not in the public list yet, so
      // your own real XP is always visible even before you opt in.
      ...(you.isPublic && real!.entries.some((e) => e.handle === you.handle)
        ? []
        : [{ handle: "You", xp: you.xpPoints, isYou: true }]),
    ].sort((a, b) => b.xp - a.xp);

    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
            <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            Ranked by real XP, app-wide — only students who&apos;ve opted into a public portfolio
            handle appear here, shown by that handle. No names, tracks, or other fields beyond what
            the{" "}
            <Link href="/features/public-handle" className="font-medium text-accent underline">
              Public Portfolio Handle
            </Link>{" "}
            feature already makes public.
          </CardContent>
        </Card>

        {!you.isPublic && (
          <Card className="border-accent/50 bg-accent/10">
            <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              You&apos;re not on the public list yet — your row below only shows to you.{" "}
              <Link href="/features/public-handle" className="font-medium text-accent underline">
                Set a public handle
              </Link>{" "}
              to appear to others.
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-2">
          {ranked.map((peer, i) => (
            <Card key={peer.handle + i} className={peer.isYou ? "border-accent/60" : undefined}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold " +
                      (i === 0 ? "bg-primary text-primary-foreground" : "bg-locked text-locked-foreground")
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="font-display font-bold">
                    {peer.handle}
                    {peer.isYou && (
                      <Badge variant="accent" className="ml-2 align-middle text-xs">
                        You
                      </Badge>
                    )}
                  </span>
                </div>
                <span className="font-display text-lg font-bold text-foreground">
                  {peer.xp.toLocaleString()} XP
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const you = { initials: "You", xp: MOCK_STUDENT.xpPoints, streak: 12, isYou: true };
  const ranked = [...SAMPLE_PEERS, you].sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample peers, anonymized to initials. Log in and opt into a public portfolio handle to see
        the real, app-wide leaderboard.
      </SampleDataBanner>

      <Card>
        <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          {CAREER_TRACK_LABELS[MOCK_STUDENT.targetCareer]} track &middot; ranked by total XP
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {ranked.map((peer, i) => (
          <Card key={peer.initials} className={peer.isYou ? "border-accent/60" : undefined}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold " +
                    (i === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-locked text-locked-foreground")
                  }
                >
                  {i + 1}
                </span>
                <span className="font-display font-bold">
                  {peer.initials}
                  {peer.isYou && (
                    <Badge variant="accent" className="ml-2 align-middle text-xs">
                      You
                    </Badge>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{peer.streak}-day streak</span>
                <span className="font-display text-lg font-bold text-foreground">
                  {peer.xp.toLocaleString()} XP
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
