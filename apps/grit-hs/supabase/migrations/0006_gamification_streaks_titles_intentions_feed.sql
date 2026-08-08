-- Streak tracking + a once-earned grace/freeze so a missed day doesn't zero
-- a real streak out (see psychology research: gain-framed, non-punitive).
alter table profiles
  add column current_streak int not null default 0,
  add column longest_streak int not null default 0,
  add column last_active_date date,
  add column streak_grace_available boolean not null default true;

-- Implementation-intention: "when will you do this?" date on a milestone.
alter table milestones
  add column planned_for date;

-- Open achievement feed (student explicitly chose the open/Part-B version
-- over a private opt-in-only feed). Still never exposes a real name by
-- default at the application layer -- the API resolves display identity to
-- the student's public handle if set, else a generic label.
create table achievement_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('milestone_completed', 'streak_milestone', 'xp_badge')),
  title text not null,
  body text,
  milestone_id uuid references milestones (id) on delete set null,
  created_at timestamptz not null default now()
);

create index achievement_posts_created_at_idx on achievement_posts (created_at desc);

alter table achievement_posts enable row level security;

create policy "achievement_posts_select_authenticated" on achievement_posts
  for select using (auth.uid() is not null);

create policy "achievement_posts_insert_own" on achievement_posts
  for insert with check (auth.uid() = user_id);

create policy "achievement_posts_delete_own" on achievement_posts
  for delete using (auth.uid() = user_id);
