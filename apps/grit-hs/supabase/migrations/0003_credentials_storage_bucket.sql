-- Grit HS — storage bucket for the Digital Credential Vault (Module 3 / #25)
-- Objects are stored at `<user_id>/<filename>` so folder-based RLS can scope
-- access to the owning user. Public sharing (is_public on user_credentials)
-- is handled by generating a signed URL server-side on request rather than
-- making the bucket itself public — keeps the storage layer private-by-default.

insert into storage.buckets (id, name, public)
values ('credentials', 'credentials', false)
on conflict (id) do nothing;

create policy "credentials_storage_select_own" on storage.objects
  for select using (
    bucket_id = 'credentials' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "credentials_storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'credentials' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "credentials_storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'credentials' and (storage.foldername(name))[1] = auth.uid()::text
  );
