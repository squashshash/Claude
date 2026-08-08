-- Right-side "Life Panel": clubs, sports, exam deadlines, class schedule,
-- and assignment reminders. A second, day-to-day system alongside the
-- long-horizon career roadmap -- all direct-owner tables, same RLS shape
-- as hours_logged/user_credentials in 0001.

create type exam_type as enum ('ap', 'sat', 'act', 'final', 'midterm', 'certification', 'other');

create type exam_status as enum ('upcoming', 'registered', 'completed');

create type reminder_priority as enum ('low', 'medium', 'high');

-- ---------------------------------------------------------------------------
-- clubs
-- ---------------------------------------------------------------------------

create table clubs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  role text,
  meeting_schedule text,
  advisor_name text,
  joined_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clubs_user_id_idx on clubs (user_id);

create trigger clubs_set_updated_at
  before update on clubs
  for each row execute function set_updated_at();

alter table clubs enable row level security;

create policy "clubs_select_own" on clubs
  for select using (auth.uid() = user_id);

create policy "clubs_insert_own" on clubs
  for insert with check (auth.uid() = user_id);

create policy "clubs_update_own" on clubs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "clubs_delete_own" on clubs
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- sports
-- ---------------------------------------------------------------------------

create table sports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  season text,
  role text,
  practice_schedule text,
  coach_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sports_user_id_idx on sports (user_id);

create trigger sports_set_updated_at
  before update on sports
  for each row execute function set_updated_at();

alter table sports enable row level security;

create policy "sports_select_own" on sports
  for select using (auth.uid() = user_id);

create policy "sports_insert_own" on sports
  for insert with check (auth.uid() = user_id);

create policy "sports_update_own" on sports
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sports_delete_own" on sports
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- exams (exam deadlines: AP/SAT/ACT/finals/certification test dates)
-- ---------------------------------------------------------------------------

create table exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  exam_type exam_type not null default 'other',
  date date not null,
  registration_deadline date,
  location text,
  status exam_status not null default 'upcoming',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index exams_user_id_idx on exams (user_id);
create index exams_date_idx on exams (user_id, date);

create trigger exams_set_updated_at
  before update on exams
  for each row execute function set_updated_at();

alter table exams enable row level security;

create policy "exams_select_own" on exams
  for select using (auth.uid() = user_id);

create policy "exams_insert_own" on exams
  for insert with check (auth.uid() = user_id);

create policy "exams_update_own" on exams
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "exams_delete_own" on exams
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- class_schedule
-- ---------------------------------------------------------------------------

create table class_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_name text not null,
  days_of_week text,
  start_time time,
  end_time time,
  room text,
  teacher_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_schedule_user_id_idx on class_schedule (user_id);

create trigger class_schedule_set_updated_at
  before update on class_schedule
  for each row execute function set_updated_at();

alter table class_schedule enable row level security;

create policy "class_schedule_select_own" on class_schedule
  for select using (auth.uid() = user_id);

create policy "class_schedule_insert_own" on class_schedule
  for insert with check (auth.uid() = user_id);

create policy "class_schedule_update_own" on class_schedule
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "class_schedule_delete_own" on class_schedule
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- reminders (assignment / task due dates)
-- ---------------------------------------------------------------------------

create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  due_date date not null,
  due_time time,
  course text,
  priority reminder_priority not null default 'medium',
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reminders_user_id_idx on reminders (user_id);
create index reminders_due_date_idx on reminders (user_id, due_date);

create trigger reminders_set_updated_at
  before update on reminders
  for each row execute function set_updated_at();

alter table reminders enable row level security;

create policy "reminders_select_own" on reminders
  for select using (auth.uid() = user_id);

create policy "reminders_insert_own" on reminders
  for insert with check (auth.uid() = user_id);

create policy "reminders_update_own" on reminders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reminders_delete_own" on reminders
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- re-apply baseline grants (0005) defensively for these 5 new tables, in case
-- this project was provisioned via the Management API rather than the
-- dashboard flow -- see 0005's own comment for why this matters.
-- ---------------------------------------------------------------------------

grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
