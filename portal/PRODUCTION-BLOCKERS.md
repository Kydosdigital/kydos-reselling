# Production Blockers

## 1. Neon activation

The production Neon project already exists.

Still required:

- enable Managed Neon Auth
- run the Academy schema
- add the Neon connection string and Auth settings to Vercel
- create the first Kydos admin Auth account

## 2. Vercel

The Academy Vercel project and academy.kydosdigital.com domain are connected.

The Hobby build-rate limit can temporarily delay automatic deployments during heavy development.

## 3. Stripe

After legal launch approval:

- create Blueprint £2,500 price
- create Build With Us £5,000 price
- create Done For You £10,000 price
- configure test-mode webhook
- complete purchase-to-enrolment QA

## 4. Legal and professional review

Before live checkout:

- solicitor-approved participant terms and cancellation wording
- data-protection review
- accountant validation of finance/tax language
- employment/jurisdiction review
- immigration adviser validation of the optional business-readiness module

## 5. Final downloads

Move the approved Word, Excel and PDF deliverables into protected customer download storage before public launch.

## 6. Launch flags

Only after QA:

ENABLE_LIVE_CHECKOUT=true
NEXT_PUBLIC_ENABLE_INDEXING=true
