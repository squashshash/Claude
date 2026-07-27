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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Class of 2030 &middot; Track Cohort
        </p>
      </div>
      <div className="flex items-center gap-4">
        <XpCounter xp={xp} />
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
