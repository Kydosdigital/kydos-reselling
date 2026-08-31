# Stripe Setup Guide

Stripe is the Kydos-model payment processor for card payments and recurring billing through the CRM.

## Before setup

Have:

- legal company name
- company number
- registered address
- business bank details
- director/owner identity details
- website
- business description
- customer support details
- refund/cancellation terms

## Setup

1. Create the Stripe account in the agency/company name.
2. Complete business verification.
3. Add the business bank account.
4. Add customer-facing business information.
5. Enable multi-factor authentication.
6. Restrict administrator access.
7. Connect Stripe to the branded CRM.
8. Test payment before going live.

## Products

Create clear service products.

Examples:

- Starter Social Media, £165/month
- Visibility Social Media, £275/month
- Pipeline, £455/month
- Partner, £655/month
- Meta Ads Management, £150/month where applicable
- Google Ads Management, £300/month where applicable
- SEO Essentials, £150/month
- SEO Growth, £299/month
- SEO Authority, £500/month
- 5-Page Website, £500 one-off
- Landing Page, £250 one-off
- CRM, £100/month
- CRM + Lead Automation, £150/month

Programme participants may change prices for their own agency.

## Recurring billing

For monthly services:
- use recurring invoices/subscriptions
- charge before the service month begins
- keep VAT configuration correct
- ensure cancellation terms match the client agreement

## Failed payments

Suggested workflow:

1. payment fails
2. automated reminder
3. manual follow-up
4. grace period begins
5. second reminder
6. service may be paused after the agency's stated grace period

Kydos currently uses approximately a two-week grace period.

## Refunds

Refunds should:
- follow the signed service terms
- be recorded in CRM
- be recorded in accounting
- preserve evidence of the reason

## Security

Never share:
- owner password
- MFA codes
- payout bank credentials

Sales staff should not need full Stripe administrator access merely to send a payment link.

## Reconciliation

Match:
- gross customer charge
- VAT where applicable
- Stripe processing fee
- net settlement
- CRM invoice
- FreeAgent/accounting entry
