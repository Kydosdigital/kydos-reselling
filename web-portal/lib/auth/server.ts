import { createNeonAuth, type NeonAuth } from "@neondatabase/auth/next/server";

export function isNeonAuthConfigured() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
}

let authInstance: NeonAuth | undefined;

export function getAuth(): NeonAuth {
  if (authInstance) return authInstance;

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
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
