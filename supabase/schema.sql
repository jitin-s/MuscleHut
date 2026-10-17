-- Run this in the Supabase SQL editor.
-- Create the first admin user in Supabase Authentication, then set:
--   raw_app_meta_data = {"role":"admin"}
-- from a trusted server-side process or the Supabase dashboard.
-- Enable an MFA factor for every admin account and require AAL2 in your
-- Supabase Auth policy before using the admin page in production.

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null check (char_length(excerpt) between 10 and 300),
  content text not null check (char_length(content) between 30 and 50000),
  author_name text not null check (char_length(author_name) between 2 and 80),
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.articles
  add column if not exists category text not null default 'Training'
    check (char_length(category) between 2 and 40);

alter table public.articles
  add column if not exists tags text[] not null default '{}';

alter table public.articles
  add column if not exists reading_time_minutes integer not null default 1
    check (reading_time_minutes between 1 and 120);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_cover_image_url_length'
      and conrelid = 'public.articles'::regclass
  ) then
    alter table public.articles
      add constraint articles_cover_image_url_length
      check (cover_image_url is null or char_length(cover_image_url) <= 500);
  end if;
end
$$;

create index if not exists articles_published_at_idx
  on public.articles (published, published_at desc);

alter table public.articles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public"
  on public.articles for select
  using (published = true);

drop policy if exists "Admins can read all articles" on public.articles;
create policy "Admins can read all articles"
  on public.articles for select
  using (public.is_admin());

drop policy if exists "Admins can create articles" on public.articles;
create policy "Admins can create articles"
  on public.articles for insert
  with check (public.is_admin());

drop policy if exists "Admins can update articles" on public.articles;
create policy "Admins can update articles"
  on public.articles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete articles" on public.articles;
create policy "Admins can delete articles"
  on public.articles for delete
  using (public.is_admin());
