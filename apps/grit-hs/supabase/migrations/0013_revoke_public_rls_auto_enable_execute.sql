-- rls_auto_enable() is a Supabase-provisioning event-trigger function (fires
-- automatically on CREATE TABLE, not part of this project's own migrations).
-- It was unintentionally exposed as a callable public RPC endpoint
-- (/rest/v1/rpc/rls_auto_enable) to anon and authenticated. It has no
-- legitimate direct caller — event triggers invoke it as the function owner
-- regardless of EXECUTE grants — so revoke the public surface per the
-- Supabase linter's own remediation for this exact finding.
--
-- Guarded: a from-scratch project may not have this function at all (it's
-- added by some Supabase provisioning paths, not universally), so this is a
-- no-op rather than an error if it doesn't exist.
do $$
begin
  if exists (select 1 from pg_proc where proname = 'rls_auto_enable' and pronamespace = 'public'::regnamespace) then
    revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
  end if;
end
$$;
