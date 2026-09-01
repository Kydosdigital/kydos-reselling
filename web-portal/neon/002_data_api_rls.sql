-- Kydos Academy: Neon Data API / RLS policies
-- Apply after 001_academy_schema.sql.
-- The Neon Data API validates the signed-in user and exposes auth.user_id().

alter table academy_users enable row level security;
alter table enrolments enable row level security;
alter table lesson_progress enable row level security;
alter table lesson_notes enable row level security;
alter table participant_intake enable row level security;
alter table implementation_tasks enable row level security;
alter table implementation_task_updates enable row level security;
alter table programme_orders enable row level security;
alter table academy_audit_log enable row level security;
alter table participant_admin_notes enable row level security;

-- Participant profile rows are read-only through the Data API. This is
-- deliberate: allowing self-update here would also expose the application
-- role column and could create a privilege-escalation path.
drop policy if exists academy_users_update_own on academy_users;
drop policy if exists academy_users_select_own on academy_users;
create policy academy_users_select_own on academy_users
  for select
  using (auth_user_id = auth.user_id());

drop policy if exists enrolments_select_own on enrolments;
create policy enrolments_select_own on enrolments
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = enrolments.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_progress_select_own on lesson_progress;
create policy lesson_progress_select_own on lesson_progress
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = lesson_progress.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_progress_insert_own on lesson_progress;
create policy lesson_progress_insert_own on lesson_progress
  for insert
  with check (
    exists (
      select 1
      from academy_users u
      where u.id = lesson_progress.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_progress_delete_own on lesson_progress;
create policy lesson_progress_delete_own on lesson_progress
  for delete
  using (
    exists (
      select 1
      from academy_users u
      where u.id = lesson_progress.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_notes_select_own on lesson_notes;
create policy lesson_notes_select_own on lesson_notes
  for select
  using (
    exists (
      select 1 from academy_users u
      where u.id = lesson_notes.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_notes_insert_own on lesson_notes;
create policy lesson_notes_insert_own on lesson_notes
  for insert
  with check (
    exists (
      select 1 from academy_users u
      where u.id = lesson_notes.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_notes_update_own on lesson_notes;
create policy lesson_notes_update_own on lesson_notes
  for update
  using (
    exists (
      select 1 from academy_users u
      where u.id = lesson_notes.user_id
        and u.auth_user_id = auth.user_id()
    )
  )
  with check (
    exists (
      select 1 from academy_users u
      where u.id = lesson_notes.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists lesson_notes_delete_own on lesson_notes;
create policy lesson_notes_delete_own on lesson_notes
  for delete
  using (
    exists (
      select 1 from academy_users u
      where u.id = lesson_notes.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists participant_intake_select_own on participant_intake;
create policy participant_intake_select_own on participant_intake
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = participant_intake.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists participant_intake_insert_own on participant_intake;
create policy participant_intake_insert_own on participant_intake
  for insert
  with check (
    exists (
      select 1
      from academy_users u
      where u.id = participant_intake.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists participant_intake_update_own on participant_intake;
create policy participant_intake_update_own on participant_intake
  for update
  using (
    exists (
      select 1
      from academy_users u
      where u.id = participant_intake.user_id
        and u.auth_user_id = auth.user_id()
    )
  )
  with check (
    exists (
      select 1
      from academy_users u
      where u.id = participant_intake.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists implementation_tasks_select_own on implementation_tasks;
create policy implementation_tasks_select_own on implementation_tasks
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = implementation_tasks.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists implementation_task_updates_select_own on implementation_task_updates;
create policy implementation_task_updates_select_own on implementation_task_updates
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = implementation_task_updates.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists implementation_task_updates_insert_own on implementation_task_updates;
create policy implementation_task_updates_insert_own on implementation_task_updates
  for insert
  with check (
    exists (
      select 1
      from academy_users u
      join implementation_tasks t on t.user_id = u.id
      where u.id = implementation_task_updates.user_id
        and t.id = implementation_task_updates.task_id
        and t.user_id = implementation_task_updates.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

drop policy if exists programme_orders_select_own on programme_orders;
create policy programme_orders_select_own on programme_orders
  for select
  using (
    exists (
      select 1
      from academy_users u
      where u.id = programme_orders.user_id
        and u.auth_user_id = auth.user_id()
    )
  );

-- No participant-facing policies are intentionally created for academy_audit_log
-- or participant_admin_notes. Kydos admin operations continue through
-- authenticated server-side code.
