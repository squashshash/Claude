import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CAREER_TRACKS, CAREER_TRACK_LABELS, type CareerTrack } from "@/lib/constants";
import { getRoadmapTemplate } from "@/lib/roadmap/templates";

export function CareerTrackStep({
  value,
  onChange,
}: {
  value: CareerTrack | undefined;
  onChange: (track: CareerTrack) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {CAREER_TRACKS.map((track) => {
        const selected = value === track;
        return (
          <button key={track} type="button" onClick={() => onChange(track)} className="text-left">
            <Card
              className={cn(
                "h-full transition-colors",
                selected ? "border-primary ring-2 ring-primary" : undefined
              )}
            >
              <CardContent className="flex flex-col gap-1.5 p-4">
                <p className="font-display text-base font-bold">{CAREER_TRACK_LABELS[track]}</p>
                <p className="text-sm text-muted-foreground">{getRoadmapTemplate(track).summary}</p>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
