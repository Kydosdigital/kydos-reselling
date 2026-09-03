import { neon } from "@neondatabase/serverless";

function connectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    ""
  );
}

export function isDatabaseConfigured() {
  return Boolean(connectionString());
}

export function getSql() {
  const value = connectionString();

  if (!value) {
    throw new Error("Academy database connection is not configured.");
  }

  return neon(value);
}
