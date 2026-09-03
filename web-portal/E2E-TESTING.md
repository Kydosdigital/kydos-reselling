# Kydos Academy E2E Testing

## Super Admin identity

Primary Super Admin email:

`Kydosdigital@gmail.com`

The Neon Auth user and matching Academy admin profile are already created.

The login page supports Google sign-in so the owner can use the Google account rather than receiving a temporary password from Kydos.

## Synthetic participant accounts

These records are deliberately synthetic and are marked `is_test = true`.

- `Kydosdigital+e2e-blueprint@gmail.com` — Blueprint
- `Kydosdigital+e2e-build@gmail.com` — Build With Us
- `Kydosdigital+e2e-dfy@gmail.com` — Done For You

Synthetic progress, intake, weekly check-ins, tasks and paid-order records are seeded so the Super Admin dashboard has realistic populated states.

## Analytics isolation

Normal Super Admin commercial analytics exclude `is_test = true` participants and orders.

Use the **Show E2E tests** control in `/admin/analytics` when validating charts and metrics against the synthetic records.

CSV exports include the `is_test` flag.

## E2E impersonation lab

Route:

`/admin/e2e`

A signed-in Neon Auth admin can impersonate each synthetic participant using the Managed Better Auth Admin plugin.

This allows real browser testing of:

- Blueprint access
- Build With Us access
- Done For You access
- dashboard next step
- lesson restrictions
- completion tracking
- lesson notes
- intake
- weekly check-ins
- implementation task conversations
- launch-readiness calculations
- protected downloads
- support/end-date behaviour
- return to Super Admin

An impersonation banner is shown in synthetic participant sessions with a **Return to Super Admin** control.

## Current runtime blocker

The Vercel project does not yet have a database connection secret.

The live health route currently reports database/auth unavailable until `DATABASE_URL` is added to Vercel and the deployment is restarted.

After the variable is present, test:

1. `/api/system/health`
2. Google sign-in with `Kydosdigital@gmail.com`
3. `/admin/analytics?tests=1`
4. `/admin/e2e`
5. impersonate all three tiers
6. complete cross-user RLS isolation checks
7. inspect Vercel runtime errors/logs after the test run

## Cleanup

Do not delete the E2E accounts until launch QA is complete.

Because they are explicitly marked as test records, they can remain available for regression testing without contaminating normal revenue and participant analytics.

If Kydos later decides to remove them, delete the synthetic Auth users and their Academy rows in a controlled maintenance task.
