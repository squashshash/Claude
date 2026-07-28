-- ---------------------------------------------------------------------------
-- Public Student Portfolio Handle (#24)
--
-- Adds an opt-in public handle to profiles. `portfolio_public` defaults to
-- false, so nothing is exposed until a student explicitly turns it on and
-- picks a handle. Public reads are served by the app's API route using the
-- service-role client (see app/api/portfolio/[handle]/route.ts) rather than
-- a public RLS policy on `profiles`, so sensitive columns (zip_code,
-- user_id, state) never get returned to an anonymous request even by
-- accident -- the API route picks exactly which fields to expose.
-- ---------------------------------------------------------------------------

alter table profiles
  add column handle text unique,
  add column portfolio_public boolean not null default false;

-- Handles are case-insensitive in practice (the app lowercases before
-- saving), but this keeps the unique constraint honest against direct SQL.
create unique index profiles_handle_lower_idx on profiles (lower(handle));

comment on column profiles.handle is
  'Public URL slug for the opt-in portfolio page at /p/[handle]. Null until the student sets one.';
comment on column profiles.portfolio_public is
  'Must be true for /api/portfolio/[handle] to serve this profile publicly. Defaults to false (opt-in only).';
