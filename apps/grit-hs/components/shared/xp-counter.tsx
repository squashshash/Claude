import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function XpCounter({ xp }: { xp: number }) {
  return (
    <Badge
      variant="accent"
      className="gap-1.5 px-4 py-1.5 text-base transition-transform duration-200 hover:scale-105"
    >
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      <span className="tabular-nums font-bold">{xp.toLocaleString()}</span>
      <span className="font-medium opacity-90">XP</span>
    </Badge>
  );
}
