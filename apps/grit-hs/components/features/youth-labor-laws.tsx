"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Clock, ExternalLink, Info, MapPin, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { STATE_LABOR_AGENCIES, findStateLaborAgency } from "@/lib/catalog/state-labor-agencies";

const AGE_1415_RULES = [
  { label: "School day", value: "Up to 3 hours" },
  { label: "School week", value: "Up to 18 hours" },
  { label: "Non-school day", value: "Up to 8 hours" },
  { label: "Non-school week", value: "Up to 40 hours" },
  { label: "Time of day", value: "7 a.m.–7 p.m. (extended to 9 p.m. from June 1–Labor Day)" },
];

export function YouthLaborLaws() {
  const { data } = useDashboardData();
  const homeState = data?.authenticated ? data.profile?.state ?? undefined : undefined;
  const [selected, setSelected] = useState<string>("");
  const appliedPreselect = useRef(false);

  // `homeState` arrives asynchronously once the profile query resolves, after
  // this component's first render — a useState initializer only runs once,
  // so it can't pick that up. Apply it the first time it shows up, but never
  // overwrite a state the student has since picked themselves.
  useEffect(() => {
    if (homeState && !appliedPreselect.current) {
      appliedPreselect.current = true;
      setSelected(homeState);
    }
  }, [homeState]);

  const agency = selected ? findStateLaborAgency(selected) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            Federal law (below) is the floor — states can only make the rules stricter, never looser.
            This page can&apos;t show you your state&apos;s exact hour limits: the source that would
            need to be checked to state them accurately blocks automated access, so instead of guessing
            a number that could be wrong, pick your state below to jump straight to the agency that
            publishes the real one.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>Find your state&apos;s rules</CardTitle>
          </div>
          <CardDescription>
            {homeState
              ? "Preselected from your profile — change it if you work in a different state."
              : "Set your state in Settings to have this preselect automatically."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="max-w-xs"
          >
            <option value="">Select a state…</option>
            {STATE_LABOR_AGENCIES.map((s) => (
              <option key={s.abbreviation} value={s.abbreviation}>
                {s.state}
              </option>
            ))}
          </Select>

          {agency && (
            <div className="flex flex-col gap-2 rounded-lg border border-glass-border/20 bg-background/30 p-4">
              <p className="text-sm text-muted-foreground">Enforced by</p>
              <p className="font-semibold">{agency.agency}</p>
              {agency.note && <p className="text-sm text-muted-foreground">{agency.note}</p>}
              <a
                href={agency.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent underline"
              >
                {agency.state}&apos;s official child labor page
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <p className="text-xs text-muted-foreground">
                Government sites restructure occasionally — if that link is dead, search &ldquo;
                {agency.state} child labor law&rdquo;.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>Ages 14–15: federal hour limits</CardTitle>
          </div>
          <CardDescription>
            The FLSA caps how much and how late 14- and 15-year-olds can work — states can only make
            this stricter, never looser.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {AGE_1415_RULES.map((rule) => (
            <div key={rule.label} className="rounded-lg border border-glass-border/20 bg-background/30 p-4">
              <p className="text-sm text-muted-foreground">{rule.label}</p>
              <p className="font-semibold">{rule.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" aria-hidden="true" />
            <CardTitle>Ages 16–17: no federal hour cap, but hazardous work is still off-limits</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            Federal law doesn&apos;t limit how many hours or how late 16- and 17-year-olds can work —
            but many states do, which is exactly what the picker above is for.
          </p>
          <p>
            Every minor under 18, regardless of age, is barred from FLSA-designated{" "}
            <span className="font-semibold text-foreground">Hazardous Occupations</span>: driving as a
            main job duty, most power-driven machinery and woodworking equipment, roofing, excavation,
            and handling explosives, among others.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            Work permits (sometimes called Employment Certificates or Age Certificates) are required
            before starting a job in most — not all — states. Your school counselor&apos;s office
            usually issues them. This app doesn&apos;t generate the permit itself; that has to come
            from your state or district.
          </div>
          <Badge variant="outline" className="ml-2 shrink-0">
            Not legal advice
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
