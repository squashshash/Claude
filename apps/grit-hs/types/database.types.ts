/**
 * Hand-written to match supabase/migrations/0001_init_schema.sql and
 * 0002_career_track_and_certifications_seed.sql. There's no live Supabase
 * project in this environment to run `supabase gen types` against — once
 * one exists, regenerate this file from it instead of hand-editing further.
 */

export type CareerTrack =
  | "pre_med_clinical_healthcare"
  | "nursing_advanced_practice"
  | "software_engineering"
  | "financial_engineering"
  | "mechanical_engineering_cad"
  | "law_public_policy";

export type GradeLevelEnum = "summer_0" | "grade_9" | "grade_10" | "grade_11" | "grade_12";

export type MilestoneCategoryEnum = "academics" | "certifications" | "ctso" | "experience";

export type MilestoneStatusEnum = "not_started" | "in_progress" | "completed" | "locked";

export type HoursCategoryEnum = "clinical" | "volunteer" | "shadowing";

export type HoursStatusEnum = "pending" | "verified" | "rejected";

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
