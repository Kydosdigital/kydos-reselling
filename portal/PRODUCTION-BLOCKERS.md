# Production Blockers

## 1. Neon database activation

Already complete:

- London Neon project created
- Managed Better Auth provisioned
- Neon Data API provisioned and linked to Neon Auth
- Academy Postgres schema applied to production neondb
- participant-facing RLS migration applied
- E2E test-data flag migration applied
- trusted production domain added to Neon Auth
- Auth application name set to Kydos Academy
- first Kydos Super Admin Auth account created for Kydosdigital@gmail.com
- Neon Auth role set to admin
- matching Academy admin profile created
- Blueprint, Build With Us and Done For You synthetic E2E accounts created and seeded
- E2E accounts explicitly flagged so they are excluded from normal commercial analytics
- Super Admin E2E impersonation lab prepared

Still required:

- add the pooled `DATABASE_URL` to the Vercel project
- redeploy so the live application can reach Neon
- complete runtime Google sign-in for Kydosdigital@gmail.com
- complete participant-vs-participant RLS isolation testing through real authenticated sessions
- complete the remaining Neon Auth production checklist (custom SMTP, email verification/password reset, localhost removal)

## 2. Vercel

The Academy Vercel project and `academy.kydosdigital.com` domain are connected.

A concrete recent build failure was traced to eager Neon Auth initialisation during build-time route inspection. The Auth API route now uses a lazy, typed handler so runtime Auth secrets are not needed merely to collect route configuration. One intermediate deployment at commit `6d7d584` still failed because the route had not yet been updated to the handler's two-argument signature; commit `86a5f61` completed that code fix.

The Hobby build-rate limit can also delay automatic deployments during heavy development.

Still required:

- add `DATABASE_URL` to Vercel Production/Preview/Development
- redeploy the current main branch
- verify `/api/system/health` reports authConfigured/databaseConfigured/databaseReachable/schemaReady = true
- runtime QA of /login, /portal, /admin/analytics and /admin/e2e

The application now has built-in fallbacks for the Neon Auth base URL. If no explicit `NEON_AUTH_COOKIE_SECRET` is supplied, the server derives a domain-separated HMAC secret from the server-only database connection secret. An explicit cookie secret remains the preferred long-term production configuration.

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

- [x] trusted domain: academy.kydosdigital.com
- [x] application name: Kydos Academy
- [x] first Kydos Auth admin created and assigned admin role
- [ ] custom SMTP
- [ ] email verification
- [ ] password reset test
- [ ] localhost disabled on production Auth

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


## 8. Super Admin analytics runtime QA

The code-level Super Admin analytics system is complete and CI-tested.

Prepared analytics include:

- login count, last login and last seen
- 7-day and 30-day active participants
- never-logged-in and stalled-learning signals
- participant and average course progress
- module and lesson completion diagnostics
- tier and cohort performance
- weekly check-in coverage, confidence and support signals
- resource download popularity
- 14-day activity trends
- implementation workload and overdue work
- paid programme revenue and account-provisioning rate
- participant activity timeline and CSV exports

Still required after Neon activation:

- confirm the new analytics columns/table are present from the production schema migration
- verify one Blueprint, one Build With Us and one Done For You test account populate analytics correctly
- verify login counters and last-seen timestamps update as designed
- verify analytics telemetry is not queryable by participant Data API roles
- verify inactivity/stalled rules against real account dates
- visually QA the Super Admin dashboard on desktop and mobile with populated data

Analytics begin accumulating when this instrumentation is deployed. Exact historic login/activity data from before instrumentation cannot be reconstructed.
