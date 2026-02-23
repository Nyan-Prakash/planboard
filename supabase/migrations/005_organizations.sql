-- ============================================================
-- Migration 005: B2B Organizations
-- ============================================================
-- NOTE: All table DDL comes first, then all RLS policies, to
-- avoid forward-reference errors (e.g. organizations policies
-- referencing organization_members before it exists).
-- ============================================================

-- 1. organizations
-- ============================================================
create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  seat_limit int not null default 10,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- 2. organization_members
-- ============================================================
create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('teacher', 'admin')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

-- Enforce one org per user
create unique index organization_members_user_unique on public.organization_members(user_id);

-- 3. organization_invites
-- ============================================================
create table public.organization_invites (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'teacher' check (role in ('teacher', 'admin')),
  token text unique not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_by uuid null references auth.users(id),
  accepted_at timestamptz null
);

-- Partial-index: one pending invite per (org, email)
create unique index organization_invites_pending_unique
  on public.organization_invites(organization_id, email)
  where status = 'pending';

-- 4. Add organization fields to profiles
-- ============================================================
alter table public.profiles
  add column if not exists organization_id uuid null references public.organizations(id),
  add column if not exists org_role text null check (org_role in ('teacher', 'admin'));

-- ============================================================
-- 5. Enable RLS (must be done before policies)
-- ============================================================
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invites enable row level security;

-- ============================================================
-- 6. RLS Policies — organizations
-- (organization_members now exists, so these references are safe)
-- ============================================================

-- Members can view their own org
create policy "Org members can view their organization"
  on public.organizations for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = id
        and om.user_id = auth.uid()
    )
  );

-- Any authenticated user can create an org
create policy "Authenticated users can create organizations"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- Only org admins can update org details
create policy "Org admins can update organizations"
  on public.organizations for update
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- ============================================================
-- 7. RLS Policies — organization_members
-- ============================================================

-- A user can always see their own membership row (no self-join needed).
-- Admins can also see all other members in their org.
-- Splitting into two non-recursive policies avoids the chicken-and-egg
-- problem where a subquery must read the same table to authorise the read.
create policy "Users can view own membership"
  on public.organization_members for select
  using (user_id = auth.uid());

create policy "Org admins can view all members"
  on public.organization_members for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- Only admins can insert members (invite acceptance uses service-role in API)
create policy "Org admins can insert members"
  on public.organization_members for insert
  with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- Only admins can update roles
create policy "Org admins can update member roles"
  on public.organization_members for update
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- Only admins can remove members
create policy "Org admins can delete members"
  on public.organization_members for delete
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- ============================================================
-- 8. RLS Policies — organization_invites
-- ============================================================

-- Org admins can view invites for their org
create policy "Org admins can view invites"
  on public.organization_invites for select
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- Anyone with the token can read a pending invite (for the /org/join page)
create policy "Anyone can view pending invite by token"
  on public.organization_invites for select
  using (status = 'pending');

-- Only org admins can create invites
create policy "Org admins can create invites"
  on public.organization_invites for insert
  with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- Only org admins can update invites (revoke); acceptance uses service-role
create policy "Org admins can update invites"
  on public.organization_invites for update
  using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = organization_id
        and om.user_id = auth.uid()
        and om.role = 'admin'
    )
  );

-- ============================================================
-- 9. Seat stats view
-- ============================================================
create or replace view public.organization_seat_stats as
select
  o.id as organization_id,
  o.seat_limit,
  coalesce(m.active_count, 0)::int as active_members_count,
  coalesce(i.pending_count, 0)::int as pending_invites_count
from public.organizations o
left join (
  select organization_id, count(*)::int as active_count
  from public.organization_members
  group by organization_id
) m on m.organization_id = o.id
left join (
  select organization_id, count(*)::int as pending_count
  from public.organization_invites
  where status = 'pending'
  group by organization_id
) i on i.organization_id = o.id;

-- ============================================================
-- 10. Indexes
-- ============================================================
create index idx_organization_members_org_id on public.organization_members(organization_id);
create index idx_organization_members_user_id on public.organization_members(user_id);
create index idx_organization_invites_org_id on public.organization_invites(organization_id);
create index idx_organization_invites_token on public.organization_invites(token);
create index idx_organization_invites_email on public.organization_invites(email);
create index idx_profiles_organization_id on public.profiles(organization_id);
