-- ============================================================
-- Planboard: Full Database Schema + RLS
-- ============================================================

-- 1. Profiles (synced from auth.users via trigger)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Generation Requests
-- ============================================================
create table public.generation_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  grade_level text not null,
  subject text not null,
  activity_type text not null,
  lesson_info text not null,
  learning_objectives text not null,
  status text default 'pending' not null,
  created_at timestamptz default now() not null
);

alter table public.generation_requests enable row level security;

create policy "Users can view own requests"
  on public.generation_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own requests"
  on public.generation_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own requests"
  on public.generation_requests for update
  using (auth.uid() = user_id);

create policy "Users can delete own requests"
  on public.generation_requests for delete
  using (auth.uid() = user_id);

create index idx_generation_requests_user_id on public.generation_requests(user_id);
create index idx_generation_requests_created_at on public.generation_requests(created_at desc);

-- 3. Activities
-- ============================================================
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  generation_request_id uuid references public.generation_requests(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null,
  summary text not null,
  content jsonb not null,
  is_public boolean default true not null,
  grade_level text not null,
  subject text not null,
  activity_type text not null,
  created_at timestamptz default now() not null
);

alter table public.activities enable row level security;

create policy "Anyone can view public activities"
  on public.activities for select
  using (is_public = true);

create policy "Users can view own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on public.activities for update
  using (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.activities for delete
  using (auth.uid() = user_id);

create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_created_at on public.activities(created_at desc);
create index idx_activities_generation_request_id on public.activities(generation_request_id);
create index idx_activities_grade_level on public.activities(grade_level);
create index idx_activities_subject on public.activities(subject);
create index idx_activities_is_public on public.activities(is_public) where is_public = true;

-- 4. Ratings
-- ============================================================
create table public.ratings (
  id uuid default gen_random_uuid() primary key,
  activity_id uuid references public.activities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  suitability integer not null check (suitability between 1 and 5),
  goal_achievement integer not null check (goal_achievement between 1 and 5),
  recommendation integer not null check (recommendation between 1 and 5),
  overall_rating integer check (overall_rating between 1 and 5),
  review_text text,
  comment text,
  created_at timestamptz default now() not null,
  constraint ratings_user_activity_unique unique (user_id, activity_id)
);

alter table public.ratings enable row level security;

create policy "Anyone can view ratings"
  on public.ratings for select
  using (true);

create policy "Users can insert own ratings"
  on public.ratings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own ratings"
  on public.ratings for update
  using (auth.uid() = user_id);

create policy "Users can delete own ratings"
  on public.ratings for delete
  using (auth.uid() = user_id);

create index idx_ratings_activity_id on public.ratings(activity_id);
create index idx_ratings_user_id on public.ratings(user_id);

-- 5. Saves (Bookmarks)
-- ============================================================
create table public.saves (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  activity_id uuid references public.activities(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint saves_user_activity_unique unique (user_id, activity_id)
);

alter table public.saves enable row level security;

create policy "Users can view own saves"
  on public.saves for select
  using (auth.uid() = user_id);

create policy "Users can insert own saves"
  on public.saves for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saves"
  on public.saves for delete
  using (auth.uid() = user_id);

create index idx_saves_user_id on public.saves(user_id);
create index idx_saves_activity_id on public.saves(activity_id);

-- 6. Activity Stats View (for marketplace aggregation)
-- ============================================================
create or replace view public.activity_stats as
select
  activity_id,
  count(*)::int as rating_count,
  round(avg(overall_rating)::numeric, 1) as avg_overall,
  round(avg(suitability)::numeric, 1) as avg_suitability,
  round(avg(goal_achievement)::numeric, 1) as avg_goal_achievement,
  round(avg(recommendation)::numeric, 1) as avg_recommendation
from public.ratings
group by activity_id;
