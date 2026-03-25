import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { Provider } from "next-auth/providers"
import { headers } from "next/headers"
import { z } from "zod"

import { env } from "@/lib/env"
import { prisma } from "@/lib/server/prisma"
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMITS,
  resetRateLimit,
} from "@/lib/server/rate-limiter"
import { verifyPassword } from "@/lib/server/security"
import { verifyAdminCredentials } from "@/lib/server/wizard-store"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

async function authenticateUser(email: string, password: string) {
  // First try DB user lookup
  try {
    const db = prisma as unknown as {
      user: {
        findUnique: (args: { where: { email: string }; include?: { organization?: boolean } }) => Promise<{
          id: string
          email: string
          name: string | null
          passwordHash: string | null
          role: string
          organizationId: string | null
        } | null>
      }
    }
    const dbUser = await db.user.findUnique({ where: { email } })
    if (dbUser?.passwordHash) {
      const valid = await verifyPassword(password, dbUser.passwordHash)
      if (valid) {
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name ?? dbUser.email,
          role: dbUser.role,
          organizationId: dbUser.organizationId ?? undefined,
        }
      }
      return null
    }
  } catch {
    // DB unavailable, fall through to wizard admin
  }

  // Fallback: legacy wizard admin credentials
  const wizardUser = await verifyAdminCredentials(email, password)
  if (wizardUser) {
    return { ...wizardUser, organizationId: undefined }
  }

  return null
}

const providers: NonNullable<NextAuthConfig["providers"]> = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      // Get client IP for rate limiting
      const headersList = await headers()
      const clientIp = getClientIdentifier(headersList)

      // Check rate limit before processing
      const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.auth)

      if (!rateLimitResult.success) {
        console.warn(
          `[SECURITY] Rate limit exceeded for ${clientIp}. ` +
            `Blocked until ${new Date(rateLimitResult.blockedUntil!).toISOString()}`
        )
        throw new Error("Too many login attempts. Please try again later.")
      }

      // Validate input
      const parsed = credentialsSchema.safeParse(credentials)

      if (!parsed.success) {
        return null
      }

      // Verify credentials (DB first, then wizard fallback)
      const user = await authenticateUser(
        parsed.data.email,
        parsed.data.password
      )

      if (user) {
        // Reset rate limit on successful login
        resetRateLimit(clientIp, RATE_LIMITS.auth.keyPrefix)
      }

      return user
    },
  }),
]

if (env.googleClientId && env.googleClientSecret) {
  providers.push(
    Google({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    })
  )
}

if (env.githubClientId && env.githubClientSecret) {
  providers.push(
    GitHub({
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
    })
  )
}

// Marketing Dashboard OIDC Provider
if (env.marketingDashboardClientId && env.marketingDashboardClientSecret) {
  const marketingDashboardProvider: Provider = {
    id: "marketing-dashboard",
    name: "Marketing Dashboard",
    type: "oidc",
    issuer: env.marketingDashboardIssuer,
    clientId: env.marketingDashboardClientId,
    clientSecret: env.marketingDashboardClientSecret,
    authorization: {
      params: {
        scope: env.marketingDashboardScope,
      },
    },
  }

  providers.push(marketingDashboardProvider)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role =
          typeof user.role === "string" ? user.role : (token.role ?? "user")
        if (user.organizationId) {
          token.organizationId = user.organizationId
        }
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        if (typeof token.sub === "string") {
          session.user.id = token.sub
        }
        session.user.role = typeof token.role === "string" ? token.role : "user"
        if (typeof token.organizationId === "string") {
          session.user.organizationId = token.organizationId
        }
      }

      return session
    },
  },
  pages: {
    signIn: "/nl/login",
    error: "/nl/login",
  },
})
