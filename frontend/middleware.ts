import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_PRESENCE_COOKIE } from "./lib/auth-cookie";

export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(AUTH_PRESENCE_COOKIE)?.value);

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/resources/:path*", "/profile/:path*", "/learn/:path*"]
};
