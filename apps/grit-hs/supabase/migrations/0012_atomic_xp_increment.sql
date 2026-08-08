-- Atomic XP adjustment. Replaces a read-then-write in application code that
-- could lose an award when two XP-granting requests overlapped: both would read
-- the same starting value and the second write would clobber the first.
--
-- SECURITY INVOKER (the default) so the caller's RLS still applies — a student
-- can only ever move their own profile's XP.
create or replace function public.increment_xp(p_user_id uuid, p_delta integer)
returns integer
language plpgsql
set search_path to ''
as $$
declare
  next_xp integer;
begin
  update public.profiles
     set xp_points = greatest(0, xp_points + p_delta)
   where user_id = p_user_id
  returning xp_points into next_xp;

  return next_xp;
end;
$$;

revoke all on function public.increment_xp(uuid, integer) from public;
grant execute on function public.increment_xp(uuid, integer) to authenticated, service_role;
