"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { CareerTrackStep } from "@/components/onboarding/career-track-step";
import { GradeLocationStep } from "@/components/onboarding/grade-location-step";
import { BaselineStep } from "@/components/onboarding/baseline-step";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/onboarding";
import { useAppStore } from "@/store/use-app-store";
import { CAREER_TRACK_LABELS, GRADE_LEVEL_LABELS } from "@/lib/constants";

const STEP_FIELDS: (keyof OnboardingInput)[][] = [
  ["targetCareer"],
  ["currentGrade", "state", "zipCode"],
  ["baseline"],
  [],
];

export default function OnboardingPage() {
  const router = useRouter();
  const step = useAppStore((s) => s.onboardingStep);
  const setStep = useAppStore((s) => s.setOnboardingStep);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<OnboardingInput>({ resolver: zodResolver(onboardingSchema) });

  const values = watch();

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep(Math.min(step + 1, 3));
  };
  const back = () => setStep(Math.max(step - 1, 0));

  const onSubmit = async (data: OnboardingInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't generate your roadmap");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="gap-4">
        <OnboardingProgress step={step} />
        <div>
          <CardTitle>Summer -0 Onboarding</CardTitle>
          <CardDescription>Four quick steps, then your 4-year roadmap generates.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          {step === 0 && (
            <CareerTrackStep
              value={values.targetCareer}
              onChange={(track) => setValue("targetCareer", track, { shouldValidate: true })}
            />
          )}
          {step === 1 && <GradeLocationStep register={register} errors={errors} />}
          {step === 2 && <BaselineStep register={register} />}
          {step === 3 && (
            <div className="flex flex-col gap-2 rounded-md bg-muted/60 p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Career track:</span>{" "}
                <span className="font-semibold">
                  {values.targetCareer ? CAREER_TRACK_LABELS[values.targetCareer] : "—"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Grade:</span>{" "}
                <span className="font-semibold">
                  {values.currentGrade ? GRADE_LEVEL_LABELS[values.currentGrade] : "—"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-semibold">
                  {values.state ? values.state.toUpperCase() : "—"} {values.zipCode}
                </span>
              </p>
            </div>
          )}
          {errors.targetCareer && step === 0 && (
            <p className="text-sm text-destructive">{errors.targetCareer.message}</p>
          )}

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={back} disabled={step === 0}>
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Generating..." : "Generate my roadmap"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
