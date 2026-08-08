"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Call after any action that changes xp_points server-side. The header badge
 * and the dashboard stat cards both read the `dashboard-state` query, so
 * invalidating it is what actually makes a new XP total show up without a
 * full page reload.
 */
export function useXpSync() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["dashboard-state"] });
  }, [queryClient]);
}
