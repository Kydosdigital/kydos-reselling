create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null check (tier in ('blueprint','build','dfy')),
  status text not null default 'active' check (status in ('pending','active','paused','complete','cancelled')),
  programme_start date,
  support_end date,
  handover_date date,
  created_at timestamptz not null default now()
);

create unique index if not exists enrolments_one_active_per_user
on public.enrolments(user_id)
where status = 'active';

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.profiles enable row level security;
alter table public.enrolments enable row level security;
alter table public.lesson_progress enable row level security;

create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can read own enrolment"
on public.enrolments for select
using (auth.uid() = user_id);

create policy "Users can read own progress"
on public.lesson_progress for select
using (auth.uid() = user_id);

create policy "Users can insert own progress"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

create policy "Users can update own progress"
on public.lesson_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own progress"
on public.lesson_progress for delete
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
