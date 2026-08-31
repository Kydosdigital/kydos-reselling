# CRM Setup Manual

This manual sets up the agency's branded CRM before advertising begins.

The participant should experience the CRM as part of their own agency infrastructure.

## Objective

By the end of setup, the CRM must be able to:

- capture a lead
- create the contact
- record the lead source
- send immediate email follow-up
- send immediate SMS follow-up
- send WhatsApp follow-up where configured
- notify the sales closer
- trigger a call within 60 seconds
- move the lead through a sales pipeline
- book a discovery call
- send an invoice/payment link
- issue an agreement for signature
- trigger client onboarding after payment
- store sales notes
- report on lead and sales outcomes

## 1. Brand the CRM

Configure:

- agency name
- logo
- favicon
- primary colour where supported
- business email
- business phone
- website
- support details
- booking calendar identity

The client should see the participant's agency, not Kydos.

## 2. Core users

Create separate users for:

### Owner

Full administrative oversight.

### Operations Manager

Broad operational access where included.

### Sales Closer

Access to:
- leads
- pipeline
- appointments
- notes
- communication
- sales reporting

### Account Manager

Access to:
- assigned client contacts
- client communication
- onboarding information
- social scheduling where used

Do not give every team member full administrator access.

## 3. Contact fields

Minimum fields:

- full name
- first name
- last name
- email
- mobile
- company name
- website
- industry
- lead source
- service interest
- package interest
- monthly marketing budget
- notes
- assigned salesperson
- pipeline stage
- appointment date
- payment status
- onboarding status

## 4. Tags

Recommended tags:

Source:
- Meta Lead
- Website Lead
- Referral
- Organic
- LinkedIn
- Other

Interest:
- Social Media
- Meta Ads
- Google Ads
- SEO
- Website
- CRM

Status:
- New Lead
- Qualified
- Unqualified
- Follow-Up
- Won
- Lost
- Client

## 5. Pipeline

Use the Sales Pipeline Template in this repository.

## 6. Calendar

Create:
- Discovery Call calendar

Configure:
- availability
- meeting duration
- buffer
- confirmation
- reminders
- reschedule link
- cancellation link

## 7. Automations

Build:

### New lead
Trigger: new enquiry

Actions:
1. create/update contact
2. apply source tag
3. create opportunity
4. assign salesperson
5. send email
6. send SMS
7. send WhatsApp where configured
8. notify salesperson
9. start 60-second call timer/process

### Booked call
Trigger: discovery call booked

Actions:
- confirmation
- reminder
- internal notification
- move pipeline stage

### Payment received
Trigger: successful payment

Actions:
- mark paid
- create client tag
- move to Won/Paid
- send onboarding email
- create onboarding task
- notify Account Manager/Operations Manager

## 8. Test before launch

Create a test lead using a real test email and phone.

Confirm:
- [ ] contact created
- [ ] source recorded
- [ ] opportunity created
- [ ] email received
- [ ] SMS received
- [ ] WhatsApp received where configured
- [ ] salesperson notified
- [ ] pipeline works
- [ ] booking works
- [ ] reminders work
- [ ] invoice works
- [ ] payment works
- [ ] agreement works
- [ ] onboarding starts

Do not launch paid advertising until the full lead journey has been tested.
