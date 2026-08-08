import * as React from "react";
import { cn } from "@/lib/utils";

// Same glass-card technique as components/ui/card.tsx (blur+saturate,
// specular highlight, translucent tint) but built on the panel-* dark
// token family instead of the app-wide light --card tokens, since this
// panel is a deliberately separate dark zone.
export const PanelCardShell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg border border-panel-border/40 bg-panel-card/80 p-5 text-panel-foreground shadow-[inset_0_1px_0_0_hsl(var(--panel-highlight)/0.2),0_8px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-[radial-gradient(120%_60%_at_15%_0%,hsl(var(--panel-highlight)/0.12),transparent_60%)] before:content-[''] hover:border-panel-border/70 hover:bg-panel-card",
        className
      )}
      {...props}
    />
  )
);
PanelCardShell.displayName = "PanelCardShell";
