# Production Blockers

Everything on this list requires an external account, professional sign-off or live environment decision.

## 1. Supabase

Create a dedicated programme Supabase project.

Reason:
The only currently connected Supabase project belongs to another Kydos application and should not be reused.

Requires:
- organisation choice
- cost confirmation
- project creation
- migrations
- admin user

## 2. Vercel

Create a new Vercel project linked to:

Kydosdigital/kydos-reselling

Root Directory:

web-portal

The existing Vercel account does not currently contain a project linked to this repository.

## 3. Stripe

After legal launch approval:

- create Blueprint £2,500 price
- create Build With Us £5,000 price
- create Done For You £10,000 price
- add price IDs to Vercel
- add webhook
- complete test-mode purchase

## 4. Legal

Before live checkout:

- solicitor approves Participant Agreement
- solicitor approves Terms
- solicitor approves Refund/Cancellation Policy
- solicitor approves digital-content consent
- solicitor approves early-service-start consent
- approved wording replaces draft web pages

## 5. Professional reviews

- accountant validates finance/tax language
- employment/legal advisers validate engagement documents
- immigration adviser validates optional sponsor-readiness module
- data-protection/privacy review completed

## 6. Downloads

Upload final approved:

- DOCX packs
- XLSX workbooks
- PDF handbooks

Student portal can already render and download Markdown/CSV source documents.

## 7. Launch flags

Only after QA:

ENABLE_LIVE_CHECKOUT=true

NEXT_PUBLIC_ENABLE_INDEXING=true
