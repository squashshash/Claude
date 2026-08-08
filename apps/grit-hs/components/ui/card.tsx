import * as React from "react";
import { cn } from "@/lib/utils";
import { bangers } from "@/app/fonts";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg border border-glass-border/60 bg-card/22 text-card-foreground shadow-[inset_0_1px_0_0_hsl(var(--glass-highlight)/0.35),0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-2xl backdrop-saturate-200 transition-all duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-[radial-gradient(120%_60%_at_15%_0%,hsl(var(--glass-highlight)/0.35),transparent_60%)] before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-1/3 after:bg-gradient-to-r after:from-transparent after:via-glass-highlight/40 after:to-transparent after:opacity-0 after:content-[''] hover:-translate-y-0.5 hover:border-glass-border/90 hover:bg-card/28 hover:shadow-[inset_0_1px_0_0_hsl(var(--glass-highlight)/0.45),0_16px_44px_-8px_rgba(0,0,0,0.6)] hover:after:opacity-100 hover:after:[animation:glass-sweep_0.9s_ease-out]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(bangers.className, "text-xl uppercase tracking-wide leading-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-5 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
