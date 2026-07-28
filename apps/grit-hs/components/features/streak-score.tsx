"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock, Medal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";

const BADGES = [
  { threshold: 1000, name: "Trailhead" },
  { threshold: 3000, name: "Switchback" },
  { threshold: 6000, name: "Summit Push" },
  { threshold: 10000, name: "Ridge Runner" },
  { threshold: 15000, name: "Grit Legend" },
];

export function StreakScore() {
  const [streak, setStreak] = useState(12);
  const [markedToday, setMarkedToday] = useState(false);
  const { data } = useDashboardData();
  const isReal = Boolean(data?.authenticated && data.profile);
  const xp = isReal ? data!.profile!.xp_points : MOCK_STUDENT.xpPoints;

  const markToday = () => {
    if (markedToday) return;
    setStreak((s) => s + 1);
    setMarkedToday(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <motion.div
              animate={markedToday ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground"
            >
              <Flame className="h-8 w-8" aria-hidden="true" />
            </motion.div>
            <p className="font-display text-4xl font-bold">{streak}-day streak</p>
            <Button onClick={markToday} disabled={markedToday} className="gap-2">
              {markedToday ? "Marked for today" : "I showed up today"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 p-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Total XP</p>
              <Badge variant={isReal ? "default" : "locked"}>{isReal ? "Your data" : "Sample data"}</Badge>
            </div>
            <p className="font-display text-4xl font-bold">{xp.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {BADGES.filter((b) => xp >= b.threshold).length} of {BADGES.length} badges unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {BADGES.map((badge, i) => {
          const unlocked = xp >= badge.threshold;
          return (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className={unlocked ? undefined : "opacity-60"}>
                <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                  <div
                    className={
                      "flex h-14 w-14 items-center justify-center rounded-full " +
                      (unlocked ? "bg-primary text-primary-foreground" : "bg-locked text-locked-foreground")
                    }
                  >
                    {unlocked ? <Medal className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <p className="font-display text-sm font-bold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.threshold.toLocaleString()} XP</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
