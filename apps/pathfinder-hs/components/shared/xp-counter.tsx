import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function XpCounter({ xp }: { xp: number }) {
  return (
    <Badge variant="accent" className="gap-1.5 px-3 py-1 text-sm">
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="tabular-nums">{xp.toLocaleString()}</span>
      <span className="font-normal opacity-90">XP</span>
    </Badge>
  );
}
