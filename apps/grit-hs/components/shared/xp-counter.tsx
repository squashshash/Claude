"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";

/**
 * `xp` is the value the server layout rendered with. That layout is a Server
 * Component, so it doesn't re-render when XP changes client-side — prefer the
 * live query when it has real data, otherwise fall back to the server value.
 */
export function XpCounter({ xp }: { xp: number }) {
  const { data } = useDashboardData();
  const liveXp = data?.authenticated ? data.profile?.xp_points : undefined;
  const displayed = liveXp ?? xp;

  return (
    <Link
      href="/roadmap"
      aria-label={`${displayed.toLocaleString()} XP — view your roadmap progress`}
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Badge
        variant="accent"
        className="cursor-pointer gap-1.5 px-4 py-1.5 text-base transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <span className="tabular-nums font-bold">{displayed.toLocaleString()}</span>
        <span className="font-medium opacity-90">XP</span>
      </Badge>
    </Link>
  );
}
