import { FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SampleDataBanner({ children }: { children: React.ReactNode }) {
  return (
    <Card className="border-accent/50 bg-accent/10">
      <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        {children}
      </CardContent>
    </Card>
  );
}
