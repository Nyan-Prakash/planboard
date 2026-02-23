-- ============================================================
-- Migration 004: Waitlist signups
-- ============================================================

create table public.waitlist_signups (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text default 'landing_page' not null,
  created_at timestamptz default now() not null
);

alter table public.waitlist_signups enable row level security;

-- Public can join the waitlist from the landing page.
create policy "Anyone can insert waitlist signups"
  on public.waitlist_signups for insert
  with check (true);

-- Read access is restricted to service role usage.
create policy "No public select on waitlist signups"
  on public.waitlist_signups for select
  using (false);
