"use client";

import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/types/database.types";

export interface DashboardStateResponse {
  configured: boolean;
  authenticated: boolean;
  profile?: Database["public"]["Tables"]["profiles"]["Row"] | null;
  roadmap?: Database["public"]["Tables"]["roadmaps"]["Row"] | null;
  milestones?: Database["public"]["Tables"]["milestones"]["Row"][];
}

const EMPTY_STATE: DashboardStateResponse = { configured: false, authenticated: false };

/**
 * Real Supabase-backed dashboard data. Returns `{ authenticated: false }`
 * (never throws) whenever there's no Supabase project configured or no
 * signed-in user — callers fall back to lib/mock-data.ts in that case so
 * every feature stays demonstrable without a live backend.
 */
export function useDashboardData() {
  return useQuery<DashboardStateResponse>({
    queryKey: ["dashboard-state"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/state");
      if (!res.ok) return EMPTY_STATE;
      return res.json();
    },
    staleTime: 30_000,
  });
}
