import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /app route and all subroutes
  if (pathname === '/app' || pathname.startsWith('/app/')) {
    const authCookie = request.cookies.get('foodlink_demo_auth');

    // If no valid auth cookie exists, redirect immediately to login
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(authCookie.value));
      if (!parsed || !parsed.email || !parsed.role) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app', '/app/:path*'],
};
