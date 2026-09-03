import { isDatabaseConfigured, getSql } from "@/lib/db";
import { isNeonAuthConfigured } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const databaseConfigured = isDatabaseConfigured();
  const authConfigured = isNeonAuthConfigured();

  let databaseReachable = false;
  let schemaReady = false;

  if (databaseConfigured) {
    try {
      const sql = getSql();
      await sql.query("select 1 as ok");
      databaseReachable = true;
      const rows = await sql.query(
        "select exists(select 1 from information_schema.tables where table_schema='public' and table_name='academy_users') as ready"
      );
      schemaReady = Boolean(rows[0]?.ready);
    } catch {
      databaseReachable = false;
    }
  }

  return Response.json({
    service: "Kydos Academy",
    authConfigured,
    databaseConfigured,
    databaseReachable,
    schemaReady,
    liveCheckoutEnabled: process.env.ENABLE_LIVE_CHECKOUT === "true",
    indexingEnabled: process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true"
  });
}
