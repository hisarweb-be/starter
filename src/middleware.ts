/** HisarWeb Design | Digital Partner - www.hisarweb.be */
import createMiddleware from "next-intl/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    const response = NextResponse.next()
    applySecurityHeaders(response)
    return response
  }

  // For /setup route, skip i18n middleware
  if (pathname.startsWith("/setup")) {
    const response = NextResponse.next()
    applySecurityHeaders(response)
    return response
  }

  // Setup guard: redirect to /setup if not yet configured
  const isSetupComplete = process.env.NEXT_PUBLIC_SETUP_COMPLETE === "true"

  if (!isSetupComplete && !pathname.startsWith("/setup")) {
    return NextResponse.redirect(new URL("/setup", request.url))
  }

  // Subdomain / tenant resolution
  const hostname = request.headers.get("host") ?? ""
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1")

  let tenantSlug: string | null = null

  if (!isLocalhost) {
    // Production: klant-slug.hisarweb.nl  →  parts[0] is the subdomain
    const parts = hostname.split(".")
    if (parts.length >= 3) {
      tenantSlug = parts[0]
    }
  } else {
    // Development: ?tenant=slug query param or x-tenant-slug header
    tenantSlug =
      request.nextUrl.searchParams.get("tenant") ??
      request.headers.get("x-tenant-slug") ??
      null
  }

  if (tenantSlug) {
    // Forward the tenant slug via a request header so server components can pick it up
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-tenant-slug", tenantSlug)

    // Apply i18n middleware first, then inject the header
    // Create a new NextRequest with updated headers
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: requestHeaders,
      body: request.body,
    })
    const intlResponse = intlMiddleware(newRequest as unknown as NextRequest)
    const response =
      intlResponse instanceof NextResponse
        ? intlResponse
        : NextResponse.next({ request: { headers: requestHeaders } })
    applySecurityHeaders(response)
    return response
  }

  // Apply i18n middleware for all other routes
  const response = intlMiddleware(request)
  applySecurityHeaders(response)
  return response
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
