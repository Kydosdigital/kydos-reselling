# Kydos Academy Deployment

## Vercel project

Repository: Kydosdigital/kydos-reselling
Root Directory: web-portal
Framework: Next.js
Domain: academy.kydosdigital.com

## Neon production project

Project: Kydos wl
Project ID: fragrant-cake-46339841
Production branch: br-shy-paper-za4cfx0d
Database: neondb
Region: AWS eu-west-2, London

## Neon setup

1. Enable Managed Neon Auth on the production branch.
2. Run neon/001_academy_schema.sql in the neondb SQL Editor.
3. Copy the pooled neondb connection string.
4. Create the first Academy admin user in Neon Auth.
5. Make the first Academy user an Auth admin in Neon Console.

## Vercel environment variables

- DATABASE_URL
- NEON_AUTH_BASE_URL
- NEON_AUTH_COOKIE_SECRET
- ACADEMY_ADMIN_EMAILS
- NEXT_PUBLIC_APP_URL=https://academy.kydosdigital.com
- NEXT_PUBLIC_CONSULTATION_URL
- NEXT_PUBLIC_ENABLE_INDEXING=false before launch
- ENABLE_LIVE_CHECKOUT=false before legal sign-off

Stripe variables are added only when checkout is ready for test mode.

## First admin

ACADEMY_ADMIN_EMAILS must include the email used for the Kydos admin Auth account.
After sign-in, the application creates the matching Academy admin record.

## Prelaunch QA

- public website desktop/mobile QA
- login and logout
- first admin access
- create participant
- participant login
- tier restrictions
- lesson completion
- intake form
- implementation board
- admin task updates
- DFY handover and 90-day support timer
- protected downloads
- Stripe test-mode checkout after legal review

Do not enable live checkout or search indexing until the relevant launch gates are complete.
