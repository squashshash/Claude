import { AlertTriangle, Clock, Info, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AGE_1415_RULES = [
  { label: "School day", value: "Up to 3 hours" },
  { label: "School week", value: "Up to 18 hours" },
  { label: "Non-school day", value: "Up to 8 hours" },
  { label: "Non-school week", value: "Up to 40 hours" },
  { label: "Time of day", value: "7 a.m.–7 p.m. (extended to 9 p.m. from June 1–Labor Day)" },
];

export function YouthLaborLaws() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          This shows the federal baseline (Fair Labor Standards Act, Fact Sheet #43) only. States can
          set stricter rules — hours, curfews, and permit requirements vary a lot by state, and this
          page doesn&apos;t have a verified state-by-state table. Always check{" "}
          <a
            href="https://www.dol.gov/agencies/whd/state/child-labor"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline"
          >
            the DOL&apos;s official state comparison table
          </a>{" "}
          for your state before relying on this.
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
            but many states do, so check your state&apos;s rules.
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
          Work permits (sometimes called Employment Certificates or Age Certificates) are required
          before starting a job in many — not all — states. Your school counselor&apos;s office usually
          issues them. This app doesn&apos;t generate the permit itself; that has to come from your
          state/district.
          <Badge variant="outline" className="ml-2 shrink-0">
            Not legal advice
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
