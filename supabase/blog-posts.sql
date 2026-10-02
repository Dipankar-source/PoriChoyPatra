-- Create the blog database and public media bucket.
-- Replace REPLACE_WITH_ADMIN_EMAIL before running this script.
-- Create the Auth user and password in Supabase Dashboard > Authentication > Users.

create table if not exists public.blog_posts (
  id text primary key,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  post_data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(post_data) = 'object')
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc)
  where status = 'published';

create index if not exists blog_posts_updated_at_idx
  on public.blog_posts (updated_at desc);

alter table public.blog_posts enable row level security;
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

create or replace function public.is_blog_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) =
    lower('REPLACE_WITH_ADMIN_EMAIL');
$$;

revoke all on function public.is_blog_admin() from public;
grant execute on function public.is_blog_admin() to authenticated;

drop policy if exists "Public can read published blog posts"
  on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Blog admin can manage blog posts"
  on public.blog_posts;
create policy "Blog admin can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using (public.is_blog_admin())
  with check (public.is_blog_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read published blog media"
  on storage.objects;
create policy "Public can read published blog media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-media');

drop policy if exists "Blog admin can upload blog media"
  on storage.objects;
create policy "Blog admin can upload blog media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-media' and public.is_blog_admin());

drop policy if exists "Blog admin can update blog media"
  on storage.objects;
create policy "Blog admin can update blog media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-media' and public.is_blog_admin())
  with check (bucket_id = 'blog-media' and public.is_blog_admin());

drop policy if exists "Blog admin can delete blog media"
  on storage.objects;
create policy "Blog admin can delete blog media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-media' and public.is_blog_admin());