-- Kydos Academy E2E test-data flags
alter table academy_users add column if not exists is_test boolean not null default false;
alter table programme_orders add column if not exists is_test boolean not null default false;

update academy_users
set is_test = true
where lower(email) like 'kydosdigital+e2e-%@gmail.com';

update programme_orders
set is_test = true
where stripe_session_id like 'e2e-%';

create index if not exists academy_users_test_role_idx on academy_users(is_test, role);
create index if not exists programme_orders_test_status_idx on programme_orders(is_test, status, created_at desc);
