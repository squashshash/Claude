import { Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { getAgeRule } from "@/lib/roadmap/age-rules";

export function AgeGateBadge({
  certRef,
  studentAge,
  studentState,
}: {
  certRef: string;
  studentAge: number;
  studentState?: string;
}) {
  const rule = getAgeRule(certRef, studentState);
  if (!rule) return null;

  const tooYoung = studentAge < rule.minAge;
  const yearsToWait = rule.minAge - studentAge;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            {tooYoung ? (
              <Badge variant="locked" className="cursor-default">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Locked &middot; age {rule.minAge}+ ({yearsToWait}{" "}
                {yearsToWait === 1 ? "year" : "years"} to go)
              </Badge>
            ) : (
              <Badge variant="default" className="cursor-default bg-primary/90">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Eligible now
              </Badge>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>{rule.notes ?? `Minimum age: ${rule.minAge}.`}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
