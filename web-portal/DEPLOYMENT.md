# Kydos Programme Portal Deployment

## Vercel

Create a new Vercel project from:

Kydosdigital/kydos-reselling

Set the project Root Directory to:

web-portal

Framework:
Next.js

## Environment variables

Required:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_CONSULTATION_URL
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_BLUEPRINT
- STRIPE_PRICE_BUILD
- STRIPE_PRICE_DFY
- ENABLE_LIVE_CHECKOUT
- NEXT_PUBLIC_ENABLE_INDEXING

Keep these OFF before launch:

ENABLE_LIVE_CHECKOUT=false

NEXT_PUBLIC_ENABLE_INDEXING=false

## Supabase

Create a dedicated programme Supabase project.

Run migrations in order:

1. supabase/schema.sql
2. supabase/002_admin_intake_implementation.sql
3. supabase/003_checkout_orders.sql

Then create the first Kydos admin Auth user.

Set its profile role:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_ADMIN_EMAIL';
```

Do not expose the service-role key in browser code.

## Stripe

Create three one-time prices:

- Blueprint, £2,500
- Build With Us, £5,000
- Done For You, £10,000

Put the Stripe price IDs into the corresponding environment variables.

Do not enable live checkout until legal review is complete.

Webhook endpoint after deployment:

https://YOUR_DOMAIN/api/stripe/webhook

Listen for:

checkout.session.completed

Add the webhook signing secret to STRIPE_WEBHOOK_SECRET.

## Consultation booking

Set NEXT_PUBLIC_CONSULTATION_URL to the Kydos consultation calendar.

## Prelaunch QA

Before public release:

- GitHub CI passes
- public sales page checked on mobile
- login tested
- participant invite tested
- tier access tested
- lesson progress tested
- intake saved
- implementation board tested
- Stripe test-mode checkout completed
- webhook provisioned participant
- Supabase invite received
- admin handover date starts 90-day DFY support timer
- legal URLs contain approved final copy
- checkout consent wording approved
- privacy/cookie implementation approved
- ENABLE_LIVE_CHECKOUT remains false until sign-off
- NEXT_PUBLIC_ENABLE_INDEXING remains false until launch

## Launch

After final approval:

1. replace draft legal pages with approved wording
2. set real Stripe live keys and price IDs
3. configure live Stripe webhook
4. set ENABLE_LIVE_CHECKOUT=true
5. set NEXT_PUBLIC_ENABLE_INDEXING=true
6. redeploy
7. test one real low-risk checkout path only if commercially authorised
8. monitor webhook and Supabase provisioning logs
