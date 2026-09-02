# Kydos Academy Analytics Data Map

This document defines the first-party telemetry collected by the Kydos Academy application for programme operations and Super Admin analytics.

## Purpose

Analytics exist to help Kydos understand:

- whether paid participants successfully activate and log in
- whether participants are engaging with the programme
- where learning progress stalls
- which modules and resources are being used
- which participants may need support
- whether implementation work is moving
- how programme tiers and cohorts are progressing
- operational payment/provisioning performance

The analytics system is not intended for advertising profiling or covert behavioural monitoring.

## Participant account fields

The Academy user record includes:

- participant name
- account email
- programme role
- last successful login timestamp
- last-seen timestamp
- successful login count

Last seen is rate-limited in application code so routine page requests do not continuously write to the database.

## Activity events

The `academy_activity_events` table may record:

- `academy_profile_provisioned`
- `login_success`
- `module_viewed`
- `lesson_viewed`
- `lesson_completed`
- `lesson_uncompleted`
- `lesson_note_saved`
- `lesson_note_deleted`
- `resource_downloaded`
- `intake_saved`
- `weekly_checkin_saved`
- `participant_task_update_added`

Event metadata must remain minimal and non-sensitive.

## Data deliberately excluded from telemetry

Do not place the following in `academy_activity_events.metadata`:

- passwords or password-reset secrets
- payment card details
- full lesson-note text
- full weekly check-in answers
- full participant intake answers
- private Kydos admin notes
- implementation conversation text
- authentication cookies or tokens
- unnecessary device fingerprinting
- precise geolocation

The source tables remain the authoritative place for participant-supplied content.

## Super Admin analytics

The Super Admin dashboard can derive:

- active participant count
- ever logged-in count
- 7-day and 30-day active participants
- never-logged-in accounts
- successful login count per participant
- last login and last seen
- completion percentage per participant
- average course completion
- progress distribution
- programme completion count
- stalled learning signals
- average module completion
- lesson completion/drop-off diagnostics
- resource download popularity
- 14-day engagement trend
- weekly check-in coverage
- average confidence
- low-confidence/support-request signals
- open, overdue and waiting implementation tasks
- programme tier mix
- enrolment cohorts
- paid programme revenue recorded in Stripe order records
- paid-account provisioning rate
- refunds and disputes
- recent participant activity

## Access control

Raw activity telemetry is admin-only.

Row Level Security is enabled for `academy_activity_events`, and no participant-facing Data API policy is created for the table.

Participant-facing pages receive only their own programme state through authorised application routes.

## Retention

No automatic analytics deletion policy should be enabled until Kydos completes its final data-protection review and agrees a retention schedule.

Before public launch, the privacy notice and retention schedule must explicitly cover Academy account activity and operational analytics.

## Accuracy limits

The dashboard should not claim measurements the application cannot reliably make.

For example:

- last seen is an application activity indicator, not proof that someone actively read the whole page
- login count records successful Academy login actions after this telemetry was introduced
- time-on-page is not currently measured
- activity before analytics deployment cannot be reconstructed accurately
- module and download popularity begin accumulating only after telemetry is live

These limits should be preserved rather than presenting inferred data as exact behaviour.
