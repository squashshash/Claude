import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { XpCounter } from "@/components/shared/xp-counter";

export function Header({
  studentName,
  xp,
}: {
  studentName: string;
  xp: number;
}) {
  const initials = studentName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border bg-background px-6 print:hidden">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Class of 2030 &middot; Track Cohort
        </p>
      </div>
      <div className="flex items-center gap-4">
        <XpCounter xp={xp} />
        <Avatar className="h-11 w-11">
          <AvatarFallback className="text-base">{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
