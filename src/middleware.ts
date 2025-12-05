import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for OpenCode API Proxying
 * Rewrites /agent requests to /api/agent for proper Next.js routing
 */
export function middleware(request: NextRequest) {
  // Rewrite /agent to /api/agent
  if (request.nextUrl.pathname === '/agent') {
    return NextResponse.rewrite(new URL('/api/agent', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    '/agent',
    // Add other OpenCode API endpoints here as needed
    // '/model',
    // '/session',
  ],
};
