import { NextRequest, NextResponse } from "next/server";

const IS_MAINTENANCE = process.env.MAINTENANCE_MODE === "true";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/maintenance" && !IS_MAINTENANCE) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/maintenance",
};
