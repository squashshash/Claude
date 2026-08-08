-- Levels up the Clinical & Volunteer Hours Logger (now living in the
-- right-side panel instead of its own nav entry): the on-screen drawn
-- signature was previously session-only (thrown away on reload, per its
-- own on-screen disclaimer) -- this gives it somewhere to actually persist,
-- plus a photographed/scanned paper-form attachment.

alter table hours_logged
  add column signature_path text,
  add column signature_captured_at timestamptz,
  add column scanned_doc_path text;

-- Same private-bucket + folder-scoped-by-user_id pattern as 0003's
-- `credentials` bucket.

insert into storage.buckets (id, name, public)
values ('hours-signatures', 'hours-signatures', false)
on conflict (id) do nothing;

create policy "hours_signatures_storage_select_own" on storage.objects
  for select using (
    bucket_id = 'hours-signatures' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "hours_signatures_storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'hours-signatures' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "hours_signatures_storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'hours-signatures' and (storage.foldername(name))[1] = auth.uid()::text
  );

insert into storage.buckets (id, name, public)
values ('hours-scans', 'hours-scans', false)
on conflict (id) do nothing;

create policy "hours_scans_storage_select_own" on storage.objects
  for select using (
    bucket_id = 'hours-scans' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "hours_scans_storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'hours-scans' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "hours_scans_storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'hours-scans' and (storage.foldername(name))[1] = auth.uid()::text
  );
