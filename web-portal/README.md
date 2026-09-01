# Kydos Academy Web Portal

This folder contains the public Kydos Academy website and the participant/admin application.

## Stack

- Next.js 16
- React 19
- Managed Neon Auth
- Neon Postgres
- Neon serverless driver
- Stripe, currently disabled for live checkout
- Vercel

## Public routes

- /
- /programme
- /compare
- /plans/blueprint
- /plans/build
- /plans/dfy
- /consultation
- /legal/terms
- /legal/refunds
- /legal/privacy

## Application routes

- /login
- /portal
- /portal/intake
- /portal/implementation
- /admin

## Neon

See neon/README.md and neon/001_academy_schema.sql.

## Environment

Copy .env.example to .env.local and configure Neon before testing protected application routes.

Live checkout and public indexing remain disabled until launch approval.
