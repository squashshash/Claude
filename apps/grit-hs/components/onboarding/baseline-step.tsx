import type { UseFormRegister } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { OnboardingInput } from "@/lib/validations/onboarding";

export function BaselineStep({ register }: { register: UseFormRegister<OnboardingInput> }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="baseline">Current extracurriculars &amp; interests (optional)</Label>
      <textarea
        id="baseline"
        rows={5}
        placeholder="Anything you're already doing — clubs, volunteering, a coding side project, HOSA..."
        {...register("baseline")}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="text-sm text-muted-foreground">
        This doesn&apos;t change your roadmap yet — it&apos;s there for future personalization.
      </p>
    </div>
  );
}
