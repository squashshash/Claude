import { cn } from "@/lib/utils";

const STEPS = ["Career track", "Grade & location", "Baseline", "Review"];

export function OnboardingProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}
          >
            {i + 1}
          </div>
          <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
          {i < STEPS.length - 1 && <div className="h-px w-6 bg-border" />}
        </div>
      ))}
    </div>
  );
}
