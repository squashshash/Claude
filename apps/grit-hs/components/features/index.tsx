import type { ComponentType } from "react";
import { GpaCalculator } from "./gpa-calculator";
import { ApIbOptimizer } from "./ap-ib-optimizer";
import { CertificationRulebook } from "./certification-rulebook";
import { CtsoStrategyEngine } from "./ctso-strategy-engine";
import { ColdOutreach } from "./cold-outreach";
import { HoursLogger } from "./hours-logger";
import { WeeklyTasks } from "./weekly-tasks";
import { StreakScore } from "./streak-score";
import { ResumeBuilder } from "./resume-builder";
import { CredentialVault } from "./credential-vault";
import { JobBoard } from "./job-board";
import { GrantFinder } from "./grant-finder";
import { SummerPrograms } from "./summer-programs";
import { MentorMatcher } from "./mentor-matcher";
import { FourYearPlanner } from "./four-year-planner";
import { LicenseTracker } from "./license-tracker";
import { TrackLeaderboard } from "./track-leaderboard";
import { CounselorExport } from "./counselor-export";
import { ParentDashboard } from "./parent-dashboard";
import { EssayDeconstructor } from "./essay-deconstructor";
import { CollegeMatcher } from "./college-matcher";
import { PTechTracker } from "./p-tech-tracker";
import { YouthLaborLaws } from "./youth-labor-laws";
import { LiabilityHub } from "./liability-hub";
import { TaxGuide } from "./tax-guide";
import { TransitPlanner } from "./transit-planner";
import { PublicHandle } from "./public-handle";

export const FEATURE_COMPONENTS: Record<string, ComponentType> = {
  "gpa-calculator": GpaCalculator,
  "ap-ib-optimizer": ApIbOptimizer,
  "certification-rulebook": CertificationRulebook,
  "ctso-strategy-engine": CtsoStrategyEngine,
  "cold-outreach": ColdOutreach,
  "hours-logger": HoursLogger,
  "weekly-tasks": WeeklyTasks,
  "streak-score": StreakScore,
  "resume-builder": ResumeBuilder,
  "credential-vault": CredentialVault,
  "job-board": JobBoard,
  "grant-finder": GrantFinder,
  "summer-programs": SummerPrograms,
  "mentor-matcher": MentorMatcher,
  "four-year-planner": FourYearPlanner,
  "license-tracker": LicenseTracker,
  "track-leaderboard": TrackLeaderboard,
  "counselor-export": CounselorExport,
  "parent-dashboard": ParentDashboard,
  "essay-deconstructor": EssayDeconstructor,
  "college-matcher": CollegeMatcher,
  "p-tech-tracker": PTechTracker,
  "youth-labor-laws": YouthLaborLaws,
  "liability-hub": LiabilityHub,
  "tax-guide": TaxGuide,
  "transit-planner": TransitPlanner,
  "public-handle": PublicHandle,
};
