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

The Hobby build-rate limit can temporarily delay automatic deployments during heavy development. It is not a code failure.

Still required:

- add the final Neon environment variables
- redeploy once the build-rate window permits
- runtime QA of /login, /portal and /admin after Neon schema activation

## 3. Stripe

Checkout code is prepared but intentionally disabled.

After legal launch approval:

- create Blueprint £2,500 Stripe price
- create Build With Us £5,000 Stripe price
- create Done For You £10,000 Stripe price
- add Stripe test-mode environment variables
- configure the webhook endpoint
- complete purchase, consent, activation and provisioning QA
- keep `ENABLE_LIVE_CHECKOUT=false` until every test passes

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

The code-level tier-aware download library is complete.

Still required:

- choose production private object storage
- upload approved Word, Excel and PDF deliverables
- replace source-file downloads with private stored-file delivery
- verify tier-specific access and expiring download links

Neon Object Storage is currently unavailable in the London project region, so do not move the core participant database solely to gain that beta service.

## 7. Launch flags

Only after QA and professional sign-off:

`ENABLE_LIVE_CHECKOUT=true`

`NEXT_PUBLIC_ENABLE_INDEXING=true`
