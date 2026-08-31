# Management Dashboard Specification

This specification can later be implemented inside the Kydos task-management/CRM environment.

## Audience

Primary:
- owner
- Operations Manager

Secondary:
- Account Managers, limited to their own accounts
- Creatives, limited to assigned work

## Dashboard 1, Owner overview

Show:

### Revenue

- active recurring clients
- MRR
- one-off revenue
- overdue invoices
- grace-period clients
- new clients this month
- lost clients this month
- churn %

### Sales

- new leads
- contacted
- qualified
- calls booked
- proposals/offers
- paid/won
- close rate
- sales revenue
- Meta acquisition spend
- CAC where available

### Delivery

- overdue tasks
- due this week
- blocked tasks
- calendars due
- reports due
- approvals outstanding

### Client health

- green
- amber
- red
- cancellation risk
- renewal due

### Capacity

- clients per Account Manager
- clients per Creative
- staff over capacity
- hiring recommendation

## Dashboard 2, Operations

Show:

- all active clients
- assigned AM
- assigned Creative
- current package
- calendar status
- Creative status
- approval status
- scheduling status
- report status
- payment risk
- health score
- next deadline

## Dashboard 3, Account Manager

Only assigned accounts.

Show:

- today's tasks
- overdue tasks
- approvals
- client messages/action needed
- weekly Creative status
- upcoming dates
- report due date

## Dashboard 4, Creative

Only assigned tasks.

Show:

- briefs
- client
- format
- due date
- priority
- revision status
- source-file requirement

## Alerts

Create alerts for:

- task overdue
- client approval overdue
- payment beyond grace threshold
- AM above upper capacity
- Creative above upper capacity
- red client health
- renewal approaching
- monthly calendar not ready by internal deadline
- monthly report late

## Owner design principle

The dashboard should answer:

1. Is money coming in?
2. Are leads being followed up?
3. Are clients being served?
4. Is anybody overloaded?
5. Which clients may leave?
6. What requires my decision?
