# Supabase Setup

The programme portal should use a dedicated Supabase project, separate from unrelated Kydos applications.

## Migration order

Run:

1. schema.sql
2. 002_admin_intake_implementation.sql
3. 003_checkout_orders.sql

## Core tables

profiles

Stores participant name, email and Kydos admin/student role.

enrolments

Stores programme tier, start date, support end and Done For You handover date.

lesson_progress

Stores participant lesson completion.

participant_intake

Stores the participant's agency setup information.

implementation_tasks

Stores Build With Us and Done For You implementation work.

programme_orders

Stores completed Stripe checkout records and consent evidence.

## First admin

Create the admin user in Supabase Auth, then run:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_ADMIN_EMAIL';
```

## Security

Student-facing access uses Row Level Security.

The service-role key is server-only and is used for:

- Kydos admin views
- participant invitation
- Stripe webhook provisioning
- implementation task management

Never prefix the service-role key with NEXT_PUBLIC_.

## Done For You support

DFY support_end remains null until the formal handover date.

When the admin records handover in the portal, the application sets support_end to 90 days after handover.
