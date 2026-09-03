import { createHash } from "node:crypto";
import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

const academyAuthBaseUrl =
  process.env.NEON_AUTH_BASE_URL ||
  "https://ep-lively-forest-za40cgbk.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth";

function academyCookieSecret() {
  if (process.env.NEON_AUTH_COOKIE_SECRET) return process.env.NEON_AUTH_COOKIE_SECRET;

  const databaseSecret =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    "";

  if (!databaseSecret) return "";

  return createHash("sha256")
    .update("kydos-academy-auth-cookie-v1:" + databaseSecret)
    .digest("base64");
}

export function isNeonAuthConfigured() {
  return Boolean(academyAuthBaseUrl && academyCookieSecret());
}

let authInstance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (authInstance) return authInstance;

  const baseUrl = academyAuthBaseUrl;
  const secret = academyCookieSecret();

  if (!baseUrl || !secret) {
    throw new Error("Neon Auth is not configured.");
  }

  authInstance = createNeonAuth({
    baseUrl,
    cookies: { secret },
    logLevel: "warn"
  });

  return authInstance;
}

type AuthHandler = ReturnType<NeonAuth["handler"]>;
let authHandlerInstance: AuthHandler | undefined;

function getAuthHandler(): AuthHandler {
  return (authHandlerInstance ??= getAuth().handler());
}

export const authHandler = {
  GET: ((request, context) => getAuthHandler().GET(request, context)) as AuthHandler["GET"],
  POST: ((request, context) => getAuthHandler().POST(request, context)) as AuthHandler["POST"]
};
