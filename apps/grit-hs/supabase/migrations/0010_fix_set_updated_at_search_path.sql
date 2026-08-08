-- Hardens set_updated_at() against search_path hijacking (Supabase/Postgres
-- linter recommendation for SECURITY DEFINER-adjacent trigger functions):
-- pins search_path to empty so the function can't be tricked into resolving
-- an unqualified identifier against an attacker-controlled schema.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
