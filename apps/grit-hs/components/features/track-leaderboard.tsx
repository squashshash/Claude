import { Trophy } from "lucide-react";
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

export function TrackLeaderboard() {
  const you = { initials: "You", xp: MOCK_STUDENT.xpPoints, streak: 12, isYou: true };
  const ranked = [...SAMPLE_PEERS, you].sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex flex-col gap-6">
      <SampleDataBanner>
        Sample peers, anonymized to initials — a real leaderboard needs opt-in cohort matching
        and privacy controls that aren&apos;t built yet. Your own XP/streak numbers above are real.
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
