alter table public.profiles
add column if not exists email text;

create unique index if not exists profiles_email_lower_unique
on public.profiles (lower(email))
where email is not null;

create table if not exists public.programme_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  tier text not null check (tier in ('blueprint','build','dfy')),
  amount_total integer,
  currency text,
  terms_accepted boolean not null default false,
  digital_content_consent boolean not null default false,
  early_service_start_consent boolean not null default false,
  consent_timestamp timestamptz,
  status text not null default 'paid'
    check (status in ('paid','refunded','disputed','cancelled')),
  provisioned_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.programme_orders enable row level security;

create policy "Users can read own orders"
on public.programme_orders for select
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email;

  return new;
end;
$$;
