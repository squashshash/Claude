import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A native <select> restyled to match Input's border/radius/focus language,
 * with the browser's default dropdown arrow hidden and replaced by a
 * themed chevron. The popup menu itself stays OS-native — a full
 * custom-rendered listbox isn't worth the extra a11y surface for the app's
 * plain pickers (state, grade, exam type). Set `dark` for the Life Panel's
 * dark-glass surfaces, which use the --panel-* token family instead.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  dark?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, dark, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border px-3 py-2 pr-9 text-sm outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          dark
            ? "border-panel-border/40 bg-panel/60 text-panel-foreground focus-visible:ring-panel-accent"
            : "border-input bg-background text-foreground focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
          dark ? "text-panel-muted" : "text-muted-foreground"
        )}
        aria-hidden="true"
      />
    </div>
  )
);
Select.displayName = "Select";

export { Select };
