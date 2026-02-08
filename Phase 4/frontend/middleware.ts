// Authentication middleware to protect routes

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedPaths = ['/dashboard'];
  const currentPath = request.nextUrl.pathname;

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path =>
    currentPath.startsWith(path)
  );

  if (isProtectedPath) {
    // Check if user has authentication token in cookies or headers
    // The token might be in cookies (from Better Auth) or in Authorization header
    const token = request.cookies.get('auth-token')?.value ||
                  request.cookies.get('better-auth.session_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.headers.get('x-auth-token') ||
                  request.cookies.get('authToken')?.value; // fallback for old token name

    if (!token) {
      // Redirect to login if no token is found
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.search = `?redirect=${encodeURIComponent(request.nextUrl.toString())}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
