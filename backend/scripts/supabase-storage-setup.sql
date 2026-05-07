-- Supabase Storage hardening for Insight-portfolio
-- Run in Supabase Dashboard → SQL Editor (project: zfthneleqnxjgbjrmtvu)
-- Idempotent: safe to re-run.

-- 1. Create private bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'insight-portfolio-private',
  'insight-portfolio-private',
  false,
  10485760, -- 10 MB
  array['image/jpeg','image/png','image/webp','image/avif','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. RLS already enabled on storage.objects by Supabase. Drop any permissive policies.
drop policy if exists "Public read" on storage.objects;
drop policy if exists "Anon insert" on storage.objects;
drop policy if exists "Anyone can upload" on storage.objects;
drop policy if exists "Anyone can read" on storage.objects;

-- 3. Deny-all for anon + authenticated. Only service_role bypasses RLS.
-- (Service role bypass is automatic; we add explicit deny for defense-in-depth.)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects'
      and policyname='insight_deny_anon_select'
  ) then
    create policy "insight_deny_anon_select"
      on storage.objects for select
      to anon, authenticated
      using (bucket_id <> 'insight-portfolio-private');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects'
      and policyname='insight_deny_anon_insert'
  ) then
    create policy "insight_deny_anon_insert"
      on storage.objects for insert
      to anon, authenticated
      with check (bucket_id <> 'insight-portfolio-private');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects'
      and policyname='insight_deny_anon_update'
  ) then
    create policy "insight_deny_anon_update"
      on storage.objects for update
      to anon, authenticated
      using (bucket_id <> 'insight-portfolio-private');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='storage' and tablename='objects'
      and policyname='insight_deny_anon_delete'
  ) then
    create policy "insight_deny_anon_delete"
      on storage.objects for delete
      to anon, authenticated
      using (bucket_id <> 'insight-portfolio-private');
  end if;
end $$;

-- 4. Sanity check: list policies
-- select policyname, cmd, roles from pg_policies
-- where schemaname='storage' and tablename='objects';
