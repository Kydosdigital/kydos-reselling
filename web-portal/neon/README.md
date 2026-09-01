# Kydos Academy Neon Setup

Neon replaces the earlier Supabase plan for the Academy application.

Project: Kydos wl
Project ID: fragrant-cake-46339841
Production branch: br-shy-paper-za4cfx0d
Region: AWS eu-west-2, London

## One-time setup

1. In Neon, open the production branch and enable Auth.
2. Copy the Auth URL.
3. Open the SQL Editor for neondb and run 001_academy_schema.sql.
4. Copy the pooled database connection string.
5. Add DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET and ACADEMY_ADMIN_EMAILS to Vercel.

NEON_AUTH_COOKIE_SECRET must be at least 32 characters.

## First Kydos admin

Create the first Kydos Academy user in Neon Auth.
In Neon Console, Auth > Users, make that user an Auth admin.
Add the same email to ACADEMY_ADMIN_EMAILS.
Sign in at /login.
The app will create the matching academy_users record with the admin application role.

## Security

DATABASE_URL and NEON_AUTH_COOKIE_SECRET are server-only.
Participant records are filtered by the authenticated Academy user.
Admin actions require an authenticated Academy admin.
Downloads are checked against active enrolment and programme tier.
