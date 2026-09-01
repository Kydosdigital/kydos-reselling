# Kydos Academy Neon Setup

Neon is the backend for the Kydos Academy application.

Project: Kydos wl  
Project ID: fragrant-cake-46339841  
Production branch: br-shy-paper-za4cfx0d  
Database: neondb  
Region: AWS eu-west-2, London

## Current backend state

Managed Better Auth has been provisioned on the production branch.

Neon Data API has been provisioned for neondb and configured to use Neon Auth.

Data API URL:

`https://ep-lively-forest-za40cgbk.apirest.c-2.eu-west-2.aws.neon.tech/neondb/rest/v1`

The application code already uses `@neondatabase/auth` for sign-in/session handling and `@neondatabase/serverless` for server-side PostgreSQL operations.

## Database setup

Apply these files in order:

1. `001_academy_schema.sql`
2. `002_data_api_rls.sql`

The second migration enables Row-Level Security for participant-facing Data API access.

## Required Vercel environment variables

`DATABASE_URL`  
`NEON_AUTH_BASE_URL`  
`NEON_AUTH_COOKIE_SECRET`  
`ACADEMY_ADMIN_EMAILS`

Recommended additional environment variable:

`NEON_DATA_API_URL=https://ep-lively-forest-za40cgbk.apirest.c-2.eu-west-2.aws.neon.tech/neondb/rest/v1`

`NEON_AUTH_COOKIE_SECRET` must be at least 32 characters and server-only.

## First Kydos admin

Create the first Kydos Academy user in Neon Auth.

Add the same email to `ACADEMY_ADMIN_EMAILS`.

When that person signs in, the app creates the matching `academy_users` record with the Academy admin role.

## Security model

Neon Auth controls identity and sessions.

Server-side administration uses the protected PostgreSQL connection.

Participant-facing Data API access is protected with PostgreSQL Row-Level Security using `auth.user_id()`.

Programme tier checks remain enforced in the application before protected lessons or downloads are served.

## Neon beta services

Kydos is happy to use Neon beta services where they are appropriate.

Managed Better Auth and Data API are usable with this London project.

At the time of this setup, Neon Object Storage, Neon Functions and Neon AI Gateway are only available for projects in AWS us-east-2. They cannot be enabled on this eu-west-2 London project. We are deliberately keeping the Academy database in London rather than moving participant data to the US solely to use those services.

For private paid programme files, use a separate private object-storage provider unless Neon expands Object Storage availability to eu-west-2.

## Production gate

Before launch:

- apply both SQL migrations
- add all required Vercel environment variables
- create and test the first Kydos admin
- test student login and tier access
- test Data API RLS with two different participant accounts
- keep Stripe checkout disabled until legal wording is approved
