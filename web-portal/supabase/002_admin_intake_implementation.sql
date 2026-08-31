create table if not exists public.participant_intake (
  user_id uuid primary key references auth.users(id) on delete cascade,
  agency_name text,
  company_status text,
  target_launch_date date,
  preferred_structure text,
  location text,
  goals text,
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.implementation_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  area text not null,
  title text not null,
  owner text,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','waiting_participant','waiting_kydos','waiting_third_party','review','complete')),
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.participant_intake enable row level security;
alter table public.implementation_tasks enable row level security;

create policy "Users can read own intake"
on public.participant_intake for select
using (auth.uid() = user_id);

create policy "Users can insert own intake"
on public.participant_intake for insert
with check (auth.uid() = user_id);

create policy "Users can update own intake"
on public.participant_intake for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read own implementation tasks"
on public.implementation_tasks for select
using (auth.uid() = user_id);
