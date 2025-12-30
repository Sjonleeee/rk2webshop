import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get("rk2-auth")?.value === "true";

  const { pathname } = request.nextUrl;

  // ✅ Always allow homepage (password screen)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 🚫 Block protected routes if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - Next.js internals
     * - API routes
     * - favicon
     * - Static assets (images, fonts, etc.)
     */
    "/((?!_next|api|favicon.ico|.*\\.(png|jpg|jpeg|svg|webp|gif|ico|woff|woff2|ttf|otf)).*)",
  ],
};
