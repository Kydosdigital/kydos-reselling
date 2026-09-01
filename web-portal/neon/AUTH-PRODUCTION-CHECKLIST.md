# Neon Auth Production Checklist for Kydos Academy

Project: Kydos wl  
Production branch: br-shy-paper-za4cfx0d  
Production app: https://academy.kydosdigital.com

This checklist is deliberately separate from development setup. Managed Better Auth is already provisioned.

## Required before participant launch

### Trusted domain

Add:

`https://academy.kydosdigital.com`

Do not rely on wildcard or unrelated Vercel preview domains for production Auth.

### Application name

Set the user-facing application name to:

`Kydos Academy`

### Email delivery

Configure a custom SMTP provider for production.

Use a Kydos-controlled sender identity, for example a dedicated Academy or support mailbox. Exact SMTP credentials must live in Neon/Vercel secrets and never in GitHub.

### Email verification

Enable email verification before live paid activation.

The paid activation flow creates the account only after a valid paid Stripe session. Email verification adds the second proof that the participant controls the checkout email address.

### Password reset

Test:

- reset email delivery
- reset link destination
- successful password update
- expired-link handling
- sign-in after reset

### Localhost

Disable production localhost access once live testing is complete.

### OAuth

Do not enable Google or GitHub login by default.

The Academy commercial model is based on paid participant accounts created against the order email. Social login can be assessed later if there is a clear support benefit.

## Required QA identities

Before launch create:

1. one Kydos admin account
2. one Blueprint test participant
3. one Build With Us test participant
4. one Done For You test participant
5. a second unrelated participant for cross-user isolation testing

Test each account in a separate browser profile.

## Security assertions

The final QA must prove:

- signed-out users cannot open /portal or /admin
- students cannot open /admin
- one student cannot see another student's intake, progress, tasks, orders or downloads
- Blueprint cannot open DFY-only lessons
- changing a URL manually does not bypass tier access
- paid activation cannot change the checkout email
- an already-provisioned Stripe session cannot create a second participant account
- admin actions are written to the Academy audit log
- database and Auth secrets do not appear in rendered HTML or browser JavaScript

## Launch state

Keep these settings until all checks pass:

`ENABLE_LIVE_CHECKOUT=false`

`NEXT_PUBLIC_ENABLE_INDEXING=false`
