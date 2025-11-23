    import { NextResponse } from 'next/server';
    import type { NextRequest } from 'next/server';

    /*
    Test via the sh test-rate-limit.sh script or using ApacheBench.
    First 60 requests within 1 minute: 200 OK
    Requests 61+: 429 Too Many Requests
    */

    // In-memory store for rate limiting
    const rateLimitStore = new Map<string, number[]>(); // Stores timestamps for each IP

    const WINDOW_MS = 60 * 1000; // 1 minute
    const MAX_REQUESTS = 60; // Max requests per minute

    function checkRateLimit(ip: string): boolean {
        const now = Date.now();
        const requests = rateLimitStore.get(ip) || [];

        // Filter out requests older than the window
        const recentRequests = requests.filter(timestamp => now - timestamp < WINDOW_MS);

        if (recentRequests.length >= MAX_REQUESTS) {
            return false; // Rate limit exceeded
        }

        recentRequests.push(now);
        rateLimitStore.set(ip, recentRequests);
        return true; // Request allowed
    }

    export function middleware(request: NextRequest) {
        const ip = request.ip || 'anonymous'; // Get IP address or a fallback

        if (!checkRateLimit(ip)) {
            return new NextResponse('Too Many Requests', { status: 429 });
        }

        return NextResponse.next();
    }

    // Optionally, define a matcher to specify which paths the middleware applies to
    export const config = {
        matcher: '/api/:path*', // Apply to all API routes
    };