-- Restore Supabase's standard baseline grants for the public schema.
-- Discovered live: a project provisioned via the Management API (rather
-- than the dashboard "New project" flow) doesn't automatically grant
-- anon/authenticated/service_role SELECT/INSERT/UPDATE/DELETE on tables
-- created by raw SQL migrations — every query failed with "permission
-- denied for table X" one layer before RLS was ever evaluated, for every
-- table, including service_role. This is what actually made every real
-- signup/write silently impossible until applied.
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
