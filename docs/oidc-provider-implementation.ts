// OIDC Provider Implementation voor NextAuth v5
// Voeg dit toe aan je marketing-dashboard src/auth.ts

import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

// OIDC Client interface
interface OidcClient {
  client_id: string
  client_secret: string
  name: string
  redirect_uris: string[]
  scope: string
}

// Database helper functie (pas aan voor je database setup)
async function getOidcClient(clientId: string): Promise<OidcClient | null> {
  try {
    // Voorbeeld met Prisma - pas aan voor je database
    const client = await prisma.oidcClient.findUnique({
      where: { client_id: clientId }
    })
    
    return client ? {
      client_id: client.clientId,
      client_secret: client.clientSecret,
      name: client.name,
      redirect_uris: client.redirectUris,
      scope: client.scope
    } : null
  } catch {
    // Fallback voor development zonder database
    if (clientId === "applet-client") {
      return {
        client_id: "applet-client",
        client_secret: process.env.APPLET_CLIENT_SECRET || "dev-secret",
        name: "HisarWeb Applet",
        redirect_uris: [
          "http://localhost:3000/api/auth/callback/marketing-dashboard",
          "https://your-applet-domain.vercel.app/api/auth/callback/marketing-dashboard"
        ],
        scope: "openid profile email"
      }
    }
    return null
  }
}

// OIDC Provider configuratie
const oidcConfig = {
  // Enable OIDC provider functionality
  issuer: process.env.NEXTAUTH_URL,
  
  // Client authenticatie
  getClient: async (clientId: string) => {
    const client = await getOidcClient(clientId)
    if (!client) return null
    
    return {
      id: client.client_id,
      name: client.name,
      secret: client.client_secret,
      redirectUris: client.redirect_uris,
      grants: ["authorization_code", "refresh_token"],
      responseTypes: ["code"],
      scope: client.scope,
    }
  },
  
  // Token configuratie
  token: {
    accessTokenLifetime: 3600, // 1 uur
    refreshTokenLifetime: 2592000, // 30 dagen
    allowRefreshTokenGrant: true,
  },
  
  // Userinfo endpoint
  userinfo: async (token: any) => {
    // Haal user info op basis van access token
    const user = await getUserFromToken(token)
    if (!user) return null
    
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      email_verified: user.emailVerified || true,
      picture: user.image,
      role: user.role,
    }
  },
}

// Helper functie om user info te krijgen
async function getUserFromToken(token: string) {
  try {
    // Implementeer token validatie en user lookup
    // Dit hangt af van je huidige user storage
    
    // Voorbeeld met JWT decode
    const decoded = jwt.decode(token) as any
    if (!decoded?.sub) return null
    
    // Haal user op uit database
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub }
    })
    
    return user
  } catch {
    return null
  }
}

// Volledige NextAuth configuratie
export const authConfig: NextAuthConfig = {
  providers: [
    // Je bestaande providers
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Je bestaande credentials logic
        const { email, password } = credentials as {
          email: string
          password: string
        }
        
        // Valideer credentials
        const user = await validateUser(email, password)
        return user
      },
    }),
    
    // Google provider (indien gebruikt)
    // Google({
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    // }),
  ],
  
  // OIDC Provider configuratie
  experimental: {
    enableOidcProvider: true,
  },
  
  // OIDC specifieke callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Standaard JWT logic
      if (user) {
        token.role = user.role || "user"
        token.organizationId = user.organizationId
      }
      
      // OIDC specifieke velden
      if (account?.provider === "oidc") {
        token.oidc = true
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.scope = account.scope
      }
      
      return token
    },
    
    async session({ session, token }) {
      // Standaard session logic
      if (session.user) {
        session.user.role = token.role as string
        if (token.organizationId) {
          session.user.organizationId = token.organizationId as string
        }
      }
      
      // OIDC specifieke velden
      if (token.oidc) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
        session.scope = token.scope as string
      }
      
      return session
    },
    
    // OIDC authorization callback
    async signIn({ user, account, profile }) {
      // Valideer of user OIDC mag gebruiken
      if (account?.provider === "oidc") {
        // Optionele validatie
        return true
      }
      return true
    },
  },
  
  // Session configuratie
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 uur
  },
  
  // Pages configuratie
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  // Events
  events: {
    async signIn(message) {
      console.log(`User ${message.user?.email} signed in`)
    },
    async signOut(message) {
      console.log(`User signed out`)
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// OIDC Provider helper functies
export class OidcProvider {
  static async validateClient(clientId: string, clientSecret?: string) {
    const client = await getOidcClient(clientId)
    if (!client) return null
    
    if (clientSecret && client.client_secret !== clientSecret) {
      return null
    }
    
    return client
  }
  
  static async validateRedirectUri(clientId: string, redirectUri: string) {
    const client = await getOidcClient(clientId)
    if (!client) return false
    
    return client.redirect_uris.includes(redirectUri)
  }
  
  static generateAuthCode(): string {
    return crypto.randomBytes(32).toString('hex')
  }
  
  static async exchangeCodeForToken(code: string, clientId: string) {
    // Implementeer code exchange logic
    // Dit vereist een auth code store
    
    const authCode = await getAuthCode(code)
    if (!authCode || authCode.clientId !== clientId) {
      throw new Error('Invalid authorization code')
    }
    
    if (authCode.expiresAt < Date.now()) {
      throw new Error('Authorization code expired')
    }
    
    // Generate access token
    const accessToken = jwt.sign(
      {
        sub: authCode.userId,
        aud: clientId,
        scope: authCode.scope,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '1h' }
    )
    
    const refreshToken = jwt.sign(
      {
        sub: authCode.userId,
        aud: clientId,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '30d' }
    )
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: authCode.scope,
    }
  }
}

// Database helpers (implementeer deze voor je setup)
async function validateUser(email: string, password: string) {
  // Je bestaande user validatie logic
  return null
}

async function getAuthCode(code: string) {
  // Implementeer auth code lookup
  return null
}
