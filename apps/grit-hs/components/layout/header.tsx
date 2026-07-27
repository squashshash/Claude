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
    <header className="sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between border-b border-glass-border/50 bg-card/30 px-6 shadow-[inset_0_-1px_0_0_hsl(var(--glass-highlight)/0.15)] backdrop-blur-2xl backdrop-saturate-150 print:hidden">
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
