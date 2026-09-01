import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const schema = fs.readFileSync(new URL("../neon/001_academy_schema.sql", import.meta.url), "utf8");
const rls = fs.readFileSync(new URL("../neon/002_data_api_rls.sql", import.meta.url), "utf8");

const tableNames = [...schema.matchAll(/create table if not exists\s+([a-zA-Z0-9_]+)/gi)].map((match) => match[1]);

test("every Academy public table enables row-level security", () => {
  for (const table of tableNames) {
    assert.match(
      rls,
      new RegExp("alter table\\s+" + table + "\\s+enable row level security", "i"),
      "RLS must be enabled for " + table
    );
  }
});

test("participant profile has no self-update policy", () => {
  assert.doesNotMatch(rls, /create policy\s+academy_users_update_own/i);
});

test("audit log and admin notes have no participant create/update policies", () => {
  assert.doesNotMatch(rls, /create policy[\s\S]*academy_audit_log[\s\S]*(for insert|for update|for delete)/i);
  assert.doesNotMatch(rls, /create policy[\s\S]*participant_admin_notes[\s\S]*(for insert|for update|for delete)/i);
});

test("implementation update insert policy checks task ownership", () => {
  assert.match(rls, /implementation_task_updates_insert_own/i);
  assert.match(rls, /t\.id\s*=\s*implementation_task_updates\.task_id/i);
  assert.match(rls, /t\.user_id\s*=\s*implementation_task_updates\.user_id/i);
});


test("participant task updates cannot spoof a Kydos author", () => {
  assert.match(rls, /implementation_task_updates\.author_role\s*=\s*'participant'/i);
  assert.match(rls, /implementation_task_updates\.author_user_id\s*=\s*implementation_task_updates\.user_id/i);
});
