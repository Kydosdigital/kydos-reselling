import { NextResponse, type NextRequest } from "next/server";
import { getAuth, isNeonAuthConfigured } from "@/lib/auth/server";

export default async function proxy(request: NextRequest) {
  if (!isNeonAuthConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("setup", "pending");
    return NextResponse.redirect(url);
  }

  const protect = getAuth().middleware({ loginUrl: "/login" });
  return protect(request);
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"]
};
