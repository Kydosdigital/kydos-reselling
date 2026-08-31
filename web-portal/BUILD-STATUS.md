# Web Portal Build Status

Last verified:
31 August 2026

## CI

GitHub Actions workflow:
Web Portal CI

Latest verified build job:
SUCCESS

Verified steps:

- repository checkout
- Node setup
- npm dependency installation
- build-time sync of programme source files
- Next.js production compilation
- TypeScript validation

The current portal codebase builds successfully in GitHub Actions.

## Implemented

- public programme sales page
- pricing and enrolment routes
- checkout consent architecture
- Stripe checkout/webhook architecture
- student authentication
- tier-aware dashboard
- in-portal lesson reading
- protected source downloads
- progress tracking
- participant intake
- implementation board
- admin participant invitations
- admin implementation tasks
- Done For You handover support timer
- Supabase schema/migrations
- prelaunch legal pages
- no-index control
- deployment documentation

## Deliberately disabled

Live checkout:
OFF until legal sign-off.

Public indexing:
OFF until launch.

## External infrastructure still required

- dedicated Supabase project
- Vercel project connected to the repository with web-portal as Root Directory
- Stripe products/prices and webhook
- approved final legal copy
- production environment variables
- final downloadable DOCX/XLSX/PDF assets
