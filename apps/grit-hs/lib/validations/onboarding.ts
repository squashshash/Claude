import { z } from "zod";
import { CAREER_TRACKS, GRADE_LEVELS } from "@/lib/constants";

export const onboardingSchema = z.object({
  targetCareer: z.enum(CAREER_TRACKS, { message: "Pick a career track" }),
  currentGrade: z.enum(GRADE_LEVELS, { message: "Pick a grade level" }),
  state: z
    .string()
    .trim()
    .length(2, "Use a 2-letter state code (e.g. TX)")
    .transform((s) => s.toUpperCase()),
  zipCode: z.string().trim().regex(/^\d{5}$/, "5-digit ZIP code"),
  baseline: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
