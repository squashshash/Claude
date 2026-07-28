"use client";

import { useState } from "react";
import { Bus, Info, LocateFixed, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransitStop {
  id: number;
  onestop_id: string;
  stop_name: string;
  served_by?: { route_short_name?: string | null; agency?: { agency_name?: string | null } }[];
}

export function TransitPlanner() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [radius, setRadius] = useState("1");
  const [stops, setStops] = useState<TransitStop[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "not_configured" | "error" | "done">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setNotice("Geolocation isn't available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLon(pos.coords.longitude.toFixed(5));
      },
      () => setNotice("Couldn't get your location — enter coordinates manually instead.")
    );
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lon) {
      setNotice("Enter a latitude and longitude, or use your location.");
      return;
    }
    setStatus("loading");
    setNotice(null);
    try {
      const params = new URLSearchParams({ lat, lon, radius });
      const res = await fetch(`/api/transit?${params.toString()}`);
      const body = await res.json();
      if (res.status === 501) {
        setStatus("not_configured");
        setNotice(body.error);
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setNotice(body.error ?? "Something went wrong.");
        return;
      }
      setStops(body.stops ?? []);
      setStatus("done");
    } catch {
      setStatus("error");
      setNotice("Couldn't reach the server.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          Real public-transit stops near a location, from Transitland&apos;s open GTFS data — not a
          full trip planner. Full point-to-point routing doesn&apos;t have a stable free API yet, so
          this shows what stops and routes are nearby instead of turn-by-turn directions.
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={search} className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Latitude</span>
              <input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g. 30.2672"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Longitude</span>
              <input
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="e.g. -97.7431"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-muted-foreground">Radius (km, max 10)</span>
              <input
                type="number"
                min={1}
                max={10}
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
              <Button type="button" size="sm" variant="outline" className="gap-2" onClick={useMyLocation}>
                <LocateFixed className="h-3.5 w-3.5" /> Use my location
              </Button>
              <Button type="submit" size="sm" className="gap-2" disabled={status === "loading"}>
                <Search className="h-3.5 w-3.5" />
                {status === "loading" ? "Searching…" : "Find nearby stops"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {notice && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">{notice}</CardContent>
        </Card>
      )}

      {status === "done" && stops.length === 0 && (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            No transit stops found within {radius}km of that location.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {stops.map((stop) => (
          <Card key={stop.id}>
            <CardContent className="flex items-start gap-3 p-5">
              <Bus className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-display font-bold">{stop.stop_name || "Unnamed stop"}</p>
                {stop.served_by && stop.served_by.length > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stop.served_by
                      .map((r) => r.route_short_name)
                      .filter(Boolean)
                      .join(", ") || "Route info unavailable"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
