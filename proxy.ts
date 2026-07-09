import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin/dashboard") || pathname === "/admin/dashboard";
  const isAdminApiPath = pathname.startsWith("/api/admin") || pathname === "/api/articles/list";

  if (isAdminPath || isAdminApiPath) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      if (isAdminApiPath) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      if (isAdminApiPath) {
        const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        response.cookies.delete("admin_token");
        return response;
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "session_expired");
      
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/:path*",
    "/api/articles/list",
  ],
};
