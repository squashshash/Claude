/**
 * Hand-written to match supabase/migrations/0001 through 0008 (a real,
 * connected Supabase project now exists — `supabase gen types` / the
 * Supabase MCP's `generate_typescript_types` could regenerate this file for
 * real going forward instead of continuing hand-edits).
 *
 * `target_career`/`career_track` columns are plain `text` with no DB-level
 * CHECK constraint (see 0001_init_schema.sql) — CareerTrack is re-exported
 * from lib/constants.ts (the single source of truth for valid pathways)
 * rather than duplicated here, so the two can't drift out of sync again.
 */

import type { CareerTrack } from "@/lib/constants";
export type { CareerTrack };

export type GradeLevelEnum = "summer_0" | "grade_9" | "grade_10" | "grade_11" | "grade_12";

export type MilestoneCategoryEnum = "academics" | "certifications" | "ctso" | "experience";

export type MilestoneStatusEnum = "not_started" | "in_progress" | "completed" | "locked";

export type HoursCategoryEnum = "clinical" | "volunteer" | "shadowing";

export type HoursStatusEnum = "pending" | "verified" | "rejected";

export type AchievementKind = "milestone_completed" | "streak_milestone" | "xp_badge";

export type ExamTypeEnum = "ap" | "sat" | "act" | "final" | "midterm" | "certification" | "other";

export type ExamStatusEnum = "upcoming" | "registered" | "completed";

export type ReminderPriorityEnum = "low" | "medium" | "high";

export type ClubCategoryEnum = "stem" | "arts" | "athletics" | "service" | "other";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          state: string | null;
          zip_code: string | null;
          target_career: CareerTrack | null;
          current_grade: GradeLevelEnum | null;
          target_graduation_year: number | null;
          xp_points: number;
          handle: string | null;
          portfolio_public: boolean;
          current_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          streak_grace_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          state?: string | null;
          zip_code?: string | null;
          target_career?: CareerTrack | null;
          current_grade?: GradeLevelEnum | null;
          target_graduation_year?: number | null;
          xp_points?: number;
          handle?: string | null;
          portfolio_public?: boolean;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          streak_grace_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      roadmaps: {
        Row: {
          id: string;
          user_id: string;
          career_track: CareerTrack;
          roadmap_json: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_track: CareerTrack;
          roadmap_json?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roadmaps"]["Insert"]>;
        Relationships: [];
      };
      milestones: {
        Row: {
          id: string;
          roadmap_id: string;
          grade_level: GradeLevelEnum;
          category: MilestoneCategoryEnum;
          title: string;
          description: string | null;
          is_completed: boolean;
          age_prerequisite: number | null;
          status: MilestoneStatusEnum;
          sort_order: number;
          planned_for: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          roadmap_id: string;
          grade_level: GradeLevelEnum;
          category: MilestoneCategoryEnum;
          title: string;
          description?: string | null;
          is_completed?: boolean;
          age_prerequisite?: number | null;
          status?: MilestoneStatusEnum;
          sort_order?: number;
          planned_for?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["milestones"]["Insert"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          category: string;
          min_age: number;
          prereqs: unknown[];
          description: string | null;
          state_rules_json: Record<string, { min_age: number; notes?: string }>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          min_age: number;
          prereqs?: unknown[];
          description?: string | null;
          state_rules_json?: Record<string, { min_age: number; notes?: string }>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certifications"]["Insert"]>;
        Relationships: [];
      };
      hours_logged: {
        Row: {
          id: string;
          user_id: string;
          category: HoursCategoryEnum;
          supervisor_name: string;
          supervisor_email: string;
          hours: number;
          date: string;
          status: HoursStatusEnum;
          notes: string | null;
          verification_token: string;
          verified_at: string | null;
          signature_path: string | null;
          signature_captured_at: string | null;
          scanned_doc_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: HoursCategoryEnum;
          supervisor_name: string;
          supervisor_email: string;
          hours: number;
          date: string;
          status?: HoursStatusEnum;
          notes?: string | null;
          verification_token?: string;
          verified_at?: string | null;
          signature_path?: string | null;
          signature_captured_at?: string | null;
          scanned_doc_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["hours_logged"]["Insert"]>;
        Relationships: [];
      };
      user_credentials: {
        Row: {
          id: string;
          user_id: string;
          cert_name: string;
          issue_date: string | null;
          expiry_date: string | null;
          document_url: string | null;
          is_verified: boolean;
          is_public: boolean;
          share_slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cert_name: string;
          issue_date?: string | null;
          expiry_date?: string | null;
          document_url?: string | null;
          is_verified?: boolean;
          is_public?: boolean;
          share_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_credentials"]["Insert"]>;
        Relationships: [];
      };
      achievement_posts: {
        Row: {
          id: string;
          user_id: string;
          kind: AchievementKind;
          title: string;
          body: string | null;
          milestone_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kind: AchievementKind;
          title: string;
          body?: string | null;
          milestone_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievement_posts"]["Insert"]>;
        Relationships: [];
      };
      clubs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: ClubCategoryEnum;
          role: string | null;
          meeting_schedule: string | null;
          advisor_name: string | null;
          joined_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category?: ClubCategoryEnum;
          role?: string | null;
          meeting_schedule?: string | null;
          advisor_name?: string | null;
          joined_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clubs"]["Insert"]>;
        Relationships: [];
      };
      sports: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          season: string | null;
          role: string | null;
          practice_schedule: string | null;
          coach_name: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          season?: string | null;
          role?: string | null;
          practice_schedule?: string | null;
          coach_name?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sports"]["Insert"]>;
        Relationships: [];
      };
      exams: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          exam_type: ExamTypeEnum;
          date: string;
          registration_deadline: string | null;
          location: string | null;
          status: ExamStatusEnum;
          notes: string | null;
          score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          exam_type?: ExamTypeEnum;
          date: string;
          registration_deadline?: string | null;
          location?: string | null;
          status?: ExamStatusEnum;
          notes?: string | null;
          score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["exams"]["Insert"]>;
        Relationships: [];
      };
      class_schedule: {
        Row: {
          id: string;
          user_id: string;
          course_name: string;
          days_of_week: string | null;
          start_time: string | null;
          end_time: string | null;
          room: string | null;
          teacher_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_name: string;
          days_of_week?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          room?: string | null;
          teacher_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["class_schedule"]["Insert"]>;
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          due_date: string;
          due_time: string | null;
          course: string | null;
          priority: ReminderPriorityEnum;
          completed: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          due_date: string;
          due_time?: string | null;
          course?: string | null;
          priority?: ReminderPriorityEnum;
          completed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_xp: {
        Args: { p_user_id: string; p_delta: number };
        Returns: number;
      };
    };
  };
}
