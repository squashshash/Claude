-- Grit HS — initial schema
-- Tables: profiles, roadmaps, milestones, certifications, hours_logged, user_credentials

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type grade_level as enum ('summer_0', 'grade_9', 'grade_10', 'grade_11', 'grade_12');

create type milestone_category as enum ('academics', 'certifications', 'ctso', 'experience');

create type milestone_status as enum ('not_started', 'in_progress', 'completed', 'locked');

create type hours_category as enum ('clinical', 'volunteer', 'shadowing');

create type hours_status as enum ('pending', 'verified', 'rejected');

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  state text,
  zip_code text,
  target_career text,
  current_grade grade_level,
  target_graduation_year smallint,
  xp_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = user_id);

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = user_id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "profiles_delete_own" on profiles
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- roadmaps
-- ---------------------------------------------------------------------------

create table roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  career_track text not null,
  roadmap_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index roadmaps_user_id_idx on roadmaps (user_id);

create trigger roadmaps_set_updated_at
  before update on roadmaps
  for each row execute function set_updated_at();

alter table roadmaps enable row level security;

create policy "roadmaps_select_own" on roadmaps
  for select using (auth.uid() = user_id);

create policy "roadmaps_insert_own" on roadmaps
  for insert with check (auth.uid() = user_id);

create policy "roadmaps_update_own" on roadmaps
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "roadmaps_delete_own" on roadmaps
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------------------

create table milestones (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid not null references roadmaps (id) on delete cascade,
  grade_level grade_level not null,
  category milestone_category not null,
  title text not null,
  description text,
  is_completed boolean not null default false,
  age_prerequisite smallint,
  status milestone_status not null default 'not_started',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index milestones_roadmap_id_idx on milestones (roadmap_id);
create index milestones_grade_category_idx on milestones (roadmap_id, grade_level, category);

create trigger milestones_set_updated_at
  before update on milestones
  for each row execute function set_updated_at();

alter table milestones enable row level security;

-- milestones have no user_id column, ownership is derived through the parent roadmap
create policy "milestones_select_own" on milestones
  for select using (
    exists (select 1 from roadmaps r where r.id = milestones.roadmap_id and r.user_id = auth.uid())
  );

create policy "milestones_insert_own" on milestones
  for insert with check (
    exists (select 1 from roadmaps r where r.id = milestones.roadmap_id and r.user_id = auth.uid())
  );

create policy "milestones_update_own" on milestones
  for update using (
    exists (select 1 from roadmaps r where r.id = milestones.roadmap_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from roadmaps r where r.id = milestones.roadmap_id and r.user_id = auth.uid())
  );

create policy "milestones_delete_own" on milestones
  for delete using (
    exists (select 1 from roadmaps r where r.id = milestones.roadmap_id and r.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- certifications (shared reference catalog, managed by service role only)
-- ---------------------------------------------------------------------------

create table certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  category text not null,
  min_age smallint not null,
  prereqs jsonb not null default '[]'::jsonb,
  description text,
  state_rules_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger certifications_set_updated_at
  before update on certifications
  for each row execute function set_updated_at();

alter table certifications enable row level security;

-- readable by any signed-in user; writes go through the service-role key only
create policy "certifications_select_authenticated" on certifications
  for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- hours_logged
-- ---------------------------------------------------------------------------

create table hours_logged (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category hours_category not null,
  supervisor_name text not null,
  supervisor_email text not null,
  hours numeric(6, 2) not null check (hours > 0),
  date date not null,
  status hours_status not null default 'pending',
  notes text,
  verification_token uuid not null default gen_random_uuid(),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hours_logged_user_id_idx on hours_logged (user_id);
create unique index hours_logged_verification_token_idx on hours_logged (verification_token);

create trigger hours_logged_set_updated_at
  before update on hours_logged
  for each row execute function set_updated_at();

alter table hours_logged enable row level security;

create policy "hours_logged_select_own" on hours_logged
  for select using (auth.uid() = user_id);

create policy "hours_logged_insert_own" on hours_logged
  for insert with check (auth.uid() = user_id);

create policy "hours_logged_update_own" on hours_logged
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "hours_logged_delete_own" on hours_logged
  for delete using (auth.uid() = user_id);

-- note: supervisor verification (Module 4) happens via a signed link that hits
-- an API route using the service-role client, since the supervisor is not an
-- authenticated app user and should not need an account to confirm hours.

-- ---------------------------------------------------------------------------
-- user_credentials
-- ---------------------------------------------------------------------------

create table user_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cert_name text not null,
  issue_date date,
  expiry_date date,
  document_url text,
  is_verified boolean not null default false,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_credentials_user_id_idx on user_credentials (user_id);

create trigger user_credentials_set_updated_at
  before update on user_credentials
  for each row execute function set_updated_at();

alter table user_credentials enable row level security;

create policy "user_credentials_select_own" on user_credentials
  for select using (auth.uid() = user_id);

-- powers the public shareable credential badge (Module 3)
create policy "user_credentials_select_public" on user_credentials
  for select using (is_public = true);

create policy "user_credentials_insert_own" on user_credentials
  for insert with check (auth.uid() = user_id);

create policy "user_credentials_update_own" on user_credentials
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_credentials_delete_own" on user_credentials
  for delete using (auth.uid() = user_id);
