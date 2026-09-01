# Production Blockers

## 1. Neon database activation

Already complete:

- London Neon project created
- Managed Better Auth provisioned
- Neon Data API provisioned
- Data API linked to Neon Auth
- Academy Postgres schema prepared
- participant-facing RLS migration prepared

Still required:

- run `web-portal/neon/001_academy_schema.sql` in neondb
- run `web-portal/neon/002_data_api_rls.sql`
- add the pooled `DATABASE_URL` to Vercel
- add the Auth URL and a new cookie secret to Vercel
- create and verify the first Kydos admin Auth account
- complete the Neon Auth production checklist
- perform two-user RLS isolation testing

## 2. Vercel

The Academy Vercel project and `academy.kydosdigital.com` domain are connected.

A concrete recent build failure was traced to eager Neon Auth initialisation during build-time route inspection. The Auth API route now uses a lazy, typed handler so runtime Auth secrets are not needed merely to collect route configuration. One intermediate deployment at commit `6d7d584` still failed because the route had not yet been updated to the handler's two-argument signature; commit `86a5f61` completed that code fix.

The Hobby build-rate limit can also delay automatic deployments during heavy development.

Still required:

- confirm a current-main Vercel deployment completes after CI is green
- add the final Neon environment variables
- runtime QA of /login, /portal and /admin after Neon schema activation

## 3. Stripe

Checkout code is prepared but intentionally disabled.

The code now separates test QA from live launch:

- `ENABLE_TEST_CHECKOUT=true` permits checkout only with a Stripe `sk_test_` key
- `ENABLE_LIVE_CHECKOUT=true` permits checkout only with a Stripe `sk_live_` key
- both flags cannot be enabled together
- test webhook events are processed only in authorised test mode
- live webhook events are processed only in authorised live mode

When Stripe test QA is authorised:

- create Blueprint £2,500 Stripe test price
- create Build With Us £5,000 Stripe test price
- create Done For You £10,000 Stripe test price
- add Stripe test-mode environment variables
- configure the test webhook endpoint
- set `ENABLE_TEST_CHECKOUT=true` only for the controlled QA window
- complete purchase, consent, activation and provisioning QA
- return `ENABLE_TEST_CHECKOUT=false` when the QA window is complete
- keep `ENABLE_LIVE_CHECKOUT=false` throughout prelaunch testing

## 4. Legal and professional review

Before live checkout:

- solicitor-approved participant terms and cancellation wording
- data-protection review
- accountant validation of finance/tax language
- employment/jurisdiction review
- immigration adviser validation of the optional business-readiness module

## 5. Production authentication settings

Before participant launch:

- trusted domain: academy.kydosdigital.com
- application name: Kydos Academy
- custom SMTP
- email verification
- password reset test
- localhost disabled on production Auth
- first Kydos Auth admin confirmed

## 6. Final downloads

The code-level tier-aware download library is complete and current download responses are protected with active-enrolment/tier checks, private no-store caching, filename sanitation and `nosniff` headers.

Still required:

- choose production private object storage
- upload approved Word, Excel and PDF deliverables
- replace source-file downloads with private stored-file delivery
- verify tier-specific access and expiring download links

Neon Object Storage is currently unavailable in the London project region, so do not move the core participant database solely to gain that beta service.

## 7. Launch flags

Prelaunch defaults:

`ENABLE_TEST_CHECKOUT=false`

`ENABLE_LIVE_CHECKOUT=false`

`NEXT_PUBLIC_ENABLE_INDEXING=false`

Only after QA and professional sign-off:

`ENABLE_LIVE_CHECKOUT=true`

`NEXT_PUBLIC_ENABLE_INDEXING=true`
