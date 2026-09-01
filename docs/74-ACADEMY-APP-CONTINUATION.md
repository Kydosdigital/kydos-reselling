# Kydos Academy App Continuation

This file is the handoff point for continued autonomous implementation.

## Current architecture

Public site and app:
- Next.js 16 on Vercel
- academy.kydosdigital.com
- web-portal is the Vercel root directory

Backend:
- Neon project: Kydos wl
- project ID: fragrant-cake-46339841
- production branch: br-shy-paper-za4cfx0d
- database: neondb
- region: AWS eu-west-2, London
- Neon Managed Better Auth provisioned
- Neon Data API provisioned and linked to Neon Auth

Safety flags that must remain in place until explicit launch approval:
- ENABLE_LIVE_CHECKOUT=false
- NEXT_PUBLIC_ENABLE_INDEXING=false

## App implementation completed in code

Participant:
- secure login architecture
- tier-aware Blueprint / Build With Us / Done For You access
- dashboard with progress, support window, implementation status and launch readiness
- 12-module programme library
- programme search
- lesson completion
- private per-lesson implementation notes
- expanded participant intake
- launch-readiness plan
- collaborative implementation-task conversations
- account and support view
- tier-aware downloads
- friendly loading and error states

Kydos admin:
- participant creation and enrolment
- detailed participant records
- intake and launch-readiness visibility
- implementation tasks
- collaborative task conversations
- internal Kydos notes
- enrolment status and support-date controls
- DFY handover and 90-day support handling
- password reset and session revocation support controls
- orders dashboard
- audit log
- operational attention queue
- filters/search
- system-status dashboard
- authorised CSV exports

Payments:
- Stripe Checkout architecture
- checkout consent persistence
- webhook signature validation
- paid-order recording
- duplicate-event/idempotency protection
- refund/dispute order-state handling
- activation blocked for refunded/disputed/cancelled orders
- existing-account linking
- new paid participant activation
- masked email on activation journey
- purchase-email confirmation before account creation

Security / QA:
- Academy Postgres schema prepared
- participant-facing RLS migration prepared
- self-role escalation through Data API blocked
- task-update author spoofing through Data API blocked
- programme source validation
- TypeScript typecheck in CI
- Node tests in CI
- static SQL/RLS security tests
- CSV spreadsheet-formula injection protection

## Manual blockers

These require console access, secrets, external credentials or professional approval:

1. Run web-portal/neon/001_academy_schema.sql in production neondb.
2. Run web-portal/neon/002_data_api_rls.sql.
3. Add final Neon variables to Vercel:
   - DATABASE_URL
   - NEON_AUTH_BASE_URL
   - NEON_AUTH_COOKIE_SECRET
   - NEON_DATA_API_URL
   - ACADEMY_ADMIN_EMAILS
4. Create and verify the first Kydos admin Auth account.
5. Configure Neon Auth production settings:
   - trusted domain
   - Kydos Academy application name
   - custom SMTP
   - email verification
   - password reset QA
   - localhost disabled before launch
6. Choose private storage for final paid DOCX/XLSX/PDF assets.
7. Complete legal/professional review.
8. Create Stripe test products/prices and webhook only when checkout QA is authorised.
9. Do not enable live checkout or indexing before final approval.

## Autonomous next priorities

On continuation:

1. Inspect the latest main branch and latest GitHub Actions run before changing anything.
2. If CI is failing, fix CI/type/test/build issues first.
3. Review recent participant/admin app code for security and data-integrity gaps.
4. Improve responsive/app UX only where it materially helps participant or Kydos operations.
5. Add tests for any important pure rule or security behaviour introduced.
6. Keep docs/07-BUILD-REGISTER.md and this continuation file accurate.
7. Check Vercel deployment status, but do not force repeated deployments while the Hobby build-rate limit is active.
8. Stop at any action that requires secret credentials, irreversible production changes, legal approval or the user's explicit permission.

## Current external deployment issue

Vercel may reject new builds temporarily because the Hobby project has hit its build-rate limit. GitHub CI is the source of truth for code health until Vercel accepts another deployment.
