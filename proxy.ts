import { NextResponse } from "next/server";
import { auth } from "@/app/auth/authOptions";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname === "/issues/new" || pathname.startsWith("/issues/edit/");
  if (isProtected && !req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/issues/new", "/issues/edit/:path*"],
};
