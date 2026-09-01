# Kydos Academy Build Status

Updated: 1 September 2026

## Public website

Built and connected to academy.kydosdigital.com.

Public routes include:
- homepage
- programme overview
- plan comparison
- Blueprint, Build With Us and Done For You detail pages
- consultation
- login
- legal/prelaunch pages

The unified Academy navbar is implemented across public pages.

## Backend architecture

Kydos Academy now uses Neon rather than Supabase.

Production backend:
- Neon project: Kydos wl
- project ID: fragrant-cake-46339841
- production branch: br-shy-paper-za4cfx0d
- database: neondb
- region: AWS eu-west-2, London
- Managed Better Auth provisioned
- Neon Data API provisioned and linked to Neon Auth

Prepared but not yet manually applied to production neondb:
- neon/001_academy_schema.sql
- neon/002_data_api_rls.sql

## Participant application

Implemented in code:
- participant authentication and route protection
- Blueprint / Build With Us / Done For You tier access
- progress dashboard
- support-window display
- 12 programme modules
- programme search
- lesson reading and protected source downloads
- lesson completion
- private per-lesson implementation notes
- expanded participant intake
- launch-readiness score and launch plan
- collaborative implementation task conversations
- account and support view
- responsive navigation
- loading and error states

## Kydos admin application

Implemented in code:
- participant creation and enrolment
- programme tier and support management
- participant search and filters
- detailed participant records
- intake and launch-readiness review
- internal Kydos notes
- implementation task creation and status management
- Kydos/participant task conversations
- DFY handover and 90-day support handling
- Auth support: temporary password reset and session revocation
- programme orders dashboard
- audit log
- operational attention queue
- system-status dashboard
- authorised CSV exports

## Stripe architecture

Implemented but intentionally disabled for live use:
- checkout session creation
- checkout consent capture
- webhook signature validation
- paid-order persistence
- duplicate event handling
- refund/dispute order status handling
- existing account linking
- new paid participant activation
- masked purchase email display
- purchase-email confirmation before account creation
- protection against activating refunded, disputed or cancelled orders

ENABLE_LIVE_CHECKOUT must remain false until legal approval and end-to-end test-mode QA are complete.

## Security and quality gates

Implemented:
- Data API RLS migration
- participant self-role escalation blocked
- participant task-author spoofing blocked
- tier checks on lessons, progress actions and downloads
- admin-only exports
- CSV spreadsheet formula-injection protection
- content-source validation
- TypeScript typecheck
- Node unit tests
- static SQL/RLS security tests
- production Next.js build

Latest full GitHub CI on the application passed:
- programme content validation: PASS
- TypeScript typecheck: PASS
- tests: PASS
- production build: PASS

## Manual / external setup still required

1. Run neon/001_academy_schema.sql in production neondb.
2. Run neon/002_data_api_rls.sql.
3. Add final Neon environment values to Vercel:
   - DATABASE_URL
   - NEON_AUTH_BASE_URL
   - NEON_AUTH_COOKIE_SECRET
   - NEON_DATA_API_URL
   - ACADEMY_ADMIN_EMAILS
4. Create and verify the first Kydos admin Auth account.
5. Configure Neon Auth production settings:
   - trusted production domain
   - Kydos Academy application name
   - custom SMTP
   - email verification
   - password reset QA
   - localhost disabled before launch
6. Complete two-user RLS isolation QA.
7. Select private production storage for approved DOCX/XLSX/PDF assets.
8. Complete solicitor/accountant/immigration-adviser review.
9. Configure Stripe test products/prices and webhook when test-mode checkout is authorised.
10. Complete end-to-end test purchase and participant provisioning QA.
11. Public launch approval.

## Deployment note

Vercel may temporarily reject automatic builds because the Hobby project has hit its build-rate limit during heavy development. GitHub CI is currently the reliable code-health signal until Vercel accepts the next deployment.

## Launch flags

Keep these values until final approval:

ENABLE_LIVE_CHECKOUT=false

NEXT_PUBLIC_ENABLE_INDEXING=false

See docs/74-ACADEMY-APP-CONTINUATION.md for the autonomous continuation handoff.
