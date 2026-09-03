import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

const academyAuthBaseUrl =
  process.env.NEON_AUTH_BASE_URL ||
  "https://ep-lively-forest-za40cgbk.neonauth.c-2.eu-west-2.aws.neon.tech/neondb/auth";

export function isNeonAuthConfigured() {
  return Boolean(academyAuthBaseUrl && process.env.NEON_AUTH_COOKIE_SECRET);
}

let authInstance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (authInstance) return authInstance;

  const baseUrl = academyAuthBaseUrl;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;

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
