import { getAuth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const handlers = getAuth().handler();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  const handlers = getAuth().handler();
  return handlers.POST(request);
}
