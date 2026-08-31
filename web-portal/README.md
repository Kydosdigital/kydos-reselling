# Kydos Digital Agency Programme Web Portal

This folder contains the first deployable MVP for the programme.

## Included

- public programme sales page
- £2,500 / £5,000 / £10,000 tier comparison
- participant login
- protected student portal
- 12-module programme structure
- tier-aware lesson access
- lesson progress tracking
- support-period display
- Supabase authentication/data schema
- responsive mobile layout

## Stack

- Next.js 15
- React 19
- TypeScript
- Supabase Auth + Postgres
- plain CSS with no UI framework dependency

## Local setup

1. Create a Supabase project.
2. Run supabase/schema.sql in the Supabase SQL editor.
3. Copy .env.example to .env.local.
4. Add:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXT_PUBLIC_CONSULTATION_URL
5. Run npm install.
6. Run npm run dev.

## Create the first participant

1. Create the user in Supabase Authentication.
2. Add an active row to public.enrolments.
3. Set tier to blueprint, build or dfy.
4. Set programme_start and support_end.

Example:

```sql
insert into public.enrolments (user_id, tier, status, programme_start, support_end)
values ('USER_UUID', 'build', 'active', current_date, current_date + 84);
```

For Done For You, the post-handover support period should eventually be calculated from the formal handover date.

## Next implementation slices

1. Kydos admin dashboard.
2. Stripe checkout and post-payment provisioning.
3. Approved DOCX/XLSX/PDF downloads through private storage.
4. Video lesson URLs and completion.
5. Participant intake form inside the portal.
6. Build With Us / Done For You implementation board.
7. WhatsApp support link and support-expiry automation.
8. Email onboarding automation.
9. Vercel deployment and domain.
10. Analytics and conversion tracking.

## Important

Legal documents in the repository remain drafts until the professional review register is completed.
