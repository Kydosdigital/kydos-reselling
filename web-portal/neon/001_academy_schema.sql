create extension if not exists pgcrypto;

create table if not exists academy_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text not null unique,
  email text not null,
  full_name text not null,
  role text not null default 'student' check (role in ('student','admin')),
  last_login_at timestamptz,
  last_seen_at timestamptz,
  login_count integer not null default 0 check (login_count >= 0),
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

create table if not exists lesson_notes (
  user_id uuid not null references academy_users(id) on delete cascade,
  lesson_id text not null,
  note text not null default '' check (char_length(note) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index if not exists lesson_notes_user_updated_idx on lesson_notes(user_id, updated_at desc);

create table if not exists participant_intake (
  user_id uuid primary key references academy_users(id) on delete cascade,
  agency_name text,
  company_status text check (company_status is null or company_status in ('not_started','name_chosen','incorporated','already_trading')),
  target_launch_date date,
  preferred_structure text check (preferred_structure is null or preferred_structure in ('owner_led','hands_off','unsure')),
  location text,
  website_status text check (website_status is null or website_status in ('not_started','briefing','in_build','live')),
  domain_status text check (domain_status is null or domain_status in ('not_started','chosen','purchased','connected')),
  crm_status text check (crm_status is null or crm_status in ('not_started','selected','configuring','live')),
  team_status text check (team_status is null or team_status in ('not_started','recruiting','partial','launch_team_ready')),
  acquisition_readiness text check (acquisition_readiness is null or acquisition_readiness in ('not_ready','building_capacity','ready_to_test','already_acquiring')),
  services_focus text,
  weekly_time_commitment text check (weekly_time_commitment is null or weekly_time_commitment in ('under_5','5_10','10_20','20_plus')),
  current_clients integer check (current_clients is null or current_clients >= 0),
  startup_budget_gbp integer check (startup_budget_gbp is null or startup_budget_gbp >= 0),
  goals text,
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists participant_weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references academy_users(id) on delete cascade,
  week_start date not null,
  wins text not null default '' check (char_length(wins) <= 6000),
  blockers text not null default '' check (char_length(blockers) <= 6000),
  next_focus text not null default '' check (char_length(next_focus) <= 6000),
  support_needed text not null default '' check (char_length(support_needed) <= 6000),
  confidence integer check (confidence is null or confidence between 1 and 5),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create index if not exists participant_weekly_checkins_user_week_idx on participant_weekly_checkins(user_id, week_start desc);

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


-- Engagement analytics for the Kydos Super Admin dashboard.
-- Store event names and non-sensitive metadata only.
alter table academy_users add column if not exists last_login_at timestamptz;
alter table academy_users add column if not exists last_seen_at timestamptz;
alter table academy_users add column if not exists login_count integer not null default 0;

create table if not exists academy_activity_events (
  id bigserial primary key,
  user_id uuid references academy_users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists academy_activity_events_user_created_idx on academy_activity_events(user_id, created_at desc);
create index if not exists academy_activity_events_type_created_idx on academy_activity_events(event_type, created_at desc);
create index if not exists academy_users_last_login_idx on academy_users(last_login_at desc) where role = 'student';
create index if not exists academy_users_last_seen_idx on academy_users(last_seen_at desc) where role = 'student';
