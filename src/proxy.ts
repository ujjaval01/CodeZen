import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Only protect the /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    // 1. If no token exists, immediately redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 2. Decode the JWT payload manually. 
      // Note: We use manual decoding here because standard 'jsonwebtoken' 
      // uses Node APIs that don't run on the Next.js Edge Runtime. 
      // The backend API will still do cryptographic signature verification.
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Base64Url decode the payload
      const payloadBase64Url = parts[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode Base64 string to JSON
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      // 3. Check if the user is an ADMIN
      if (payload.role !== 'ADMIN') {
        // If they are logged in but not an admin, redirect them away
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // 4. If valid admin, allow request to render the admin portal
      return NextResponse.next();
    } catch (err) {
      // If decoding fails, token is malformed, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // All other routes bypass middleware
  return NextResponse.next();
}

// Configure middleware to only trigger on admin routes for performance
export const config = {
  matcher: ['/admin/:path*'],
};
