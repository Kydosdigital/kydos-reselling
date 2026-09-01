create extension if not exists pgcrypto;

create table if not exists academy_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null unique,
  email text not null,
  full_name text not null,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists academy_users_email_lower_unique on academy_users (lower(email));

create table if not exists enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references academy_users(id) on delete cascade,
  tier text not null check (tier in ('blueprint','build','dfy')),
  status text not null default 'active' check (status in ('pending','active','paused','complete','cancelled')),
  programme_start date,
  support_end date,
  handover_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists enrolments_one_active_per_user on enrolments(user_id) where status = 'active';
create index if not exists enrolments_status_idx on enrolments(status);

create table if not exists lesson_progress (
  user_id uuid not null references academy_users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists participant_intake (
  user_id uuid primary key references academy_users(id) on delete cascade,
  agency_name text,
  company_status text,
  target_launch_date date,
  preferred_structure text,
  location text,
  website_status text,
  domain_status text,
  crm_status text,
  team_status text,
  acquisition_readiness text,
  services_focus text,
  weekly_time_commitment text,
  current_clients integer check (current_clients is null or current_clients >= 0),
  startup_budget_gbp integer check (startup_budget_gbp is null or startup_budget_gbp >= 0),
  goals text,
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists implementation_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references academy_users(id) on delete cascade,
  area text not null,
  title text not null,
  owner text,
  status text not null default 'not_started' check (status in ('not_started','in_progress','waiting_participant','waiting_kydos','waiting_third_party','review','complete')),
  due_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists implementation_tasks_user_status_idx on implementation_tasks(user_id, status);

create table if not exists implementation_task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references implementation_tasks(id) on delete cascade,
  user_id uuid not null references academy_users(id) on delete cascade,
  author_user_id uuid references academy_users(id) on delete set null,
  author_role text not null check (author_role in ('participant','admin','system')),
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists implementation_task_updates_task_created_idx on implementation_task_updates(task_id, created_at);
create index if not exists implementation_task_updates_user_created_idx on implementation_task_updates(user_id, created_at desc);

create table if not exists programme_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  user_id uuid references academy_users(id) on delete set null,
  email text not null,
  full_name text,
  tier text not null check (tier in ('blueprint','build','dfy')),
  amount_total integer,
  currency text,
  terms_accepted boolean not null default false,
  digital_content_consent boolean not null default false,
  early_service_start_consent boolean not null default false,
  consent_timestamp timestamptz,
  status text not null default 'paid' check (status in ('paid','refunded','disputed','cancelled')),
  provisioned_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists programme_orders_email_idx on programme_orders(lower(email));

create table if not exists academy_audit_log (
  id bigserial primary key,
  actor_user_id uuid references academy_users(id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists academy_audit_log_created_idx on academy_audit_log(created_at desc);

create table if not exists participant_admin_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references academy_users(id) on delete cascade,
  author_user_id uuid references academy_users(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists participant_admin_notes_user_created_idx on participant_admin_notes(user_id, created_at desc);
