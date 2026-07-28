"use client";

import { useState } from "react";
import { Car, Info, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TARGET_HOURS = 50;

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export function LicenseTracker() {
  const [permitDate, setPermitDate] = useState("");
  const [drivingHours, setDrivingHours] = useState(12);
  const [driversEdDone, setDriversEdDone] = useState(false);
  const [roadTestDate, setRoadTestDate] = useState("");

  const pct = Math.min(100, Math.round((drivingHours / TARGET_HOURS) * 100));
  const days = daysUntil(roadTestDate);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          The 50-hour target is a common state minimum, not universal — check your own
          state&apos;s graduated-license requirements before treating it as a hard rule.
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Permit obtained</CardDescription>
            <CardTitle className="text-2xl">
              <input
                type="date"
                value={permitDate}
                onChange={(e) => setPermitDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-lg"
              />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Driver&apos;s ed course</CardDescription>
            <CardTitle className="text-2xl">
              <button
                onClick={() => setDriversEdDone((d) => !d)}
                className={
                  "rounded-full px-4 py-1.5 text-base font-semibold transition-colors " +
                  (driversEdDone ? "bg-primary text-primary-foreground" : "bg-locked text-locked-foreground")
                }
              >
                {driversEdDone ? "Completed" : "Not yet"}
              </button>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-base">Target road test</CardDescription>
            <CardTitle className="text-2xl">
              <input
                type="date"
                value={roadTestDate}
                onChange={(e) => setRoadTestDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-1 text-lg"
              />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {days !== null && (
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Car className="h-6 w-6 text-accent" aria-hidden="true" />
            <p className="font-display text-lg font-bold">
              {days > 0
                ? `${days} day${days === 1 ? "" : "s"} until your road test`
                : days === 0
                  ? "Road test is today — good luck!"
                  : `Road test was ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Supervised driving hours logged
            </span>
            <Badge variant={pct >= 100 ? "default" : "accent"}>
              {drivingHours} / {TARGET_HOURS}h
            </Badge>
          </div>
          <Progress value={pct} className="h-3" />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setDrivingHours((h) => Math.max(0, h - 1))}
              aria-label="Remove an hour"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setDrivingHours((h) => h + 1)}
              aria-label="Add an hour"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Log an hour after each supervised drive</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
