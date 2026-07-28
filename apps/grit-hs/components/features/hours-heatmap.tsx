"use client";

const WEEKS = 12;
const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function intensityClass(hours: number): string {
  if (hours <= 0) return "bg-locked/40";
  if (hours < 1) return "bg-accent/25";
  if (hours < 2) return "bg-accent/50";
  if (hours < 4) return "bg-accent/75";
  return "bg-accent";
}

export function HoursHeatmap({ entries }: { entries: { date: string; hours: number }[] }) {
  const byDate = new Map<string, number>();
  for (const e of entries) byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.hours);

  const today = startOfDay(new Date());
  const totalDays = WEEKS * 7;
  // Align the grid so the last column ends on today's day-of-week.
  const gridStart = new Date(today.getTime() - (totalDays - 1 - today.getDay()) * DAY_MS);

  const columns: { date: Date; key: string; hours: number }[][] = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(gridStart.getTime() + (w * 7 + d) * DAY_MS);
      const key = date.toISOString().slice(0, 10);
      return { date, key, hours: byDate.get(key) ?? 0 };
    })
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {columns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(({ key, hours, date }) => (
              <div
                key={key}
                title={`${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })} — ${hours}h logged`}
                className={`h-3.5 w-3.5 rounded-sm ${
                  date > today ? "bg-transparent" : intensityClass(hours)
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-locked/40" />
        <div className="h-3 w-3 rounded-sm bg-accent/25" />
        <div className="h-3 w-3 rounded-sm bg-accent/50" />
        <div className="h-3 w-3 rounded-sm bg-accent/75" />
        <div className="h-3 w-3 rounded-sm bg-accent" />
        <span>More</span>
        <span className="ml-2">Last {WEEKS} weeks</span>
      </div>
    </div>
  );
}
