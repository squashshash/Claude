import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GRADE_LEVELS, GRADE_LEVEL_LABELS } from "@/lib/constants";
import type { OnboardingInput } from "@/lib/validations/onboarding";

export function GradeLocationStep({
  register,
  errors,
}: {
  register: UseFormRegister<OnboardingInput>;
  errors: FieldErrors<OnboardingInput>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="currentGrade">Current grade</Label>
        <Select id="currentGrade" {...register("currentGrade")}>
          <option value="">Select a grade</option>
          {GRADE_LEVELS.map((g) => (
            <option key={g} value={g}>
              {GRADE_LEVEL_LABELS[g]}
            </option>
          ))}
        </Select>
        {errors.currentGrade && <p className="text-sm text-destructive">{errors.currentGrade.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="TX" maxLength={2} {...register("state")} />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zipCode">ZIP code</Label>
          <Input id="zipCode" placeholder="75201" maxLength={5} {...register("zipCode")} />
          {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        State/ZIP drive the age-gate rules on your certifications — some credentials have
        different minimum ages by state.
      </p>
    </div>
  );
}
