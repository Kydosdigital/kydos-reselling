# Kydos Academy Deployment

## Vercel project

Repository: Kydosdigital/kydos-reselling  
Root Directory: web-portal  
Framework: Next.js  
Domain: academy.kydosdigital.com

## Neon production project

Project: Kydos wl  
Project ID: fragrant-cake-46339841  
Production branch: br-shy-paper-za4cfx0d  
Database: neondb  
Region: AWS eu-west-2, London

## Current Neon state

Completed:

- Managed Better Auth is provisioned on the production branch
- Neon Data API is provisioned for neondb
- Data API is configured to use Neon Auth
- application code has been migrated away from Supabase
- Academy schema migration is prepared
- participant-facing RLS migration is prepared

Still required in Neon Console:

1. Run `neon/001_academy_schema.sql` in the neondb SQL Editor.
2. Run `neon/002_data_api_rls.sql`.
3. Copy the pooled neondb connection string.
4. Copy the Managed Better Auth URL.
5. Complete the production Auth checklist below.
6. Create the first Academy administrator and make that Auth user an admin.

## Vercel environment variables

Required before portal runtime QA:

- `DATABASE_URL`
- `NEON_AUTH_BASE_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEON_DATA_API_URL=https://ep-lively-forest-za40cgbk.apirest.c-2.eu-west-2.aws.neon.tech/neondb/rest/v1`
- `ACADEMY_ADMIN_EMAILS`
- `NEXT_PUBLIC_APP_URL=https://academy.kydosdigital.com`
- `NEXT_PUBLIC_CONSULTATION_URL`
- `NEXT_PUBLIC_ENABLE_INDEXING=false`
- `ENABLE_LIVE_CHECKOUT=false`

`NEON_AUTH_COOKIE_SECRET` must be a new random secret of at least 32 characters and must never be committed to GitHub.

Stripe variables are added in test mode only when checkout QA begins.

## Managed Better Auth production checklist

Before public launch:

- add `https://academy.kydosdigital.com` as a trusted production domain
- set the Auth application name to `Kydos Academy`
- configure a reliable custom SMTP provider before relying on production email flows
- enable email verification for participant accounts
- keep Google/GitHub OAuth disabled unless Kydos deliberately decides to offer it
- disable localhost access on the production Auth configuration
- test password reset delivery and expiry
- verify a participant cannot access another participant's Data API rows

The default shared Neon email provider is acceptable for development but should not be relied on for production deliverability.

## First Kydos admin

1. Create the Auth user in Neon.
2. Make that user an Auth admin in Neon Console.
3. Add the same email to `ACADEMY_ADMIN_EMAILS`.
4. Sign in at `/login`.
5. The application creates the matching Academy admin record.

The Academy application role and the Neon Auth admin role are intentionally separate controls.

## Purchase and activation flow

The prepared checkout flow is:

1. participant completes Stripe Checkout
2. Stripe webhook records the paid order and checkout consents
3. existing Academy accounts are linked automatically
4. new participants use the secure payment-session activation route
5. the activation route creates the Neon Auth account and Academy participant record
6. the correct programme tier and support dates are applied
7. the paid order is linked to the participant

Live checkout remains disabled until legal approval and full test-mode QA.

## Prelaunch QA

Public:
- homepage and navigation desktop/mobile
- Programme, comparison, plan and consultation routes
- legal/footer links
- no-index flag

Authentication:
- login and logout
- first admin
- participant account activation
- email verification
- password reset
- unauthenticated portal/admin redirects

Participant app:
- tier restrictions
- next-step dashboard
- lesson completion
- expanded intake
- implementation board
- account/support page
- tier-aware downloads

Admin:
- create participant
- participant detail record
- internal notes
- enrolment status
- support dates
- implementation tasks
- DFY handover and 90-day support timer
- orders dashboard
- audit log

Payments:
- test-mode checkout
- webhook signature
- consent persistence
- existing-account purchase
- new-account activation
- duplicate webhook/idempotency
- cancelled checkout

Security:
- Data API RLS with two different participant accounts
- admin route protection
- no credentials in client bundle
- protected download checks
- audit log coverage

Do not enable live checkout or search indexing until the launch gates are complete.
