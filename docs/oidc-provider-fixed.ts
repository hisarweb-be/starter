// OIDC Provider Implementation voor NextAuth v5 (Corrected Version)
// Dit is een template - pas aan voor je specifieke setup

import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { jwt } from "jsonwebtoken"

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
    // const client = await prisma.oidcClient.findUnique({
    //   where: { client_id: clientId }
    // })
    
    // Voor development zonder database - fallback
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
  } catch {
    return null
  }
}

// Volledige NextAuth configuratie met OIDC support
export const authConfig: NextAuthConfig = {
  providers: [
    // Je bestaande providers
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        
        // Valideer credentials - implementeer je eigen logic
        // const user = await validateUser(email, password)
        // return user
        
        // Voorbeeld fallback
        if (email === "admin@hisarweb.be" && password === "change-me-now") {
          return {
            id: "1",
            email: "admin@hisarweb.be",
            name: "Admin User",
            role: "admin",
          }
        }
        
        return null
      },
    }),
  ],
  
  // Session configuratie
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 uur
  },
  
  // JWT callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Standaard JWT logic
      if (user) {
        token.role = (user as any).role || "user"
        token.organizationId = (user as any).organizationId
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
        (session.user as any).role = token.role as string
        if (token.organizationId) {
          (session.user as any).organizationId = token.organizationId as string
        }
      }
      
      // OIDC specifieke velden (extend session interface)
      if (token.oidc) {
        (session as any).accessToken = token.accessToken as string
        (session as any).refreshToken = token.refreshToken as string
        (session as any).expiresAt = token.expiresAt as number
        (session as any).scope = token.scope as string
      }
      
      return session
    },
  },
  
  // Pages configuratie
  pages: {
    signIn: "/login",
    error: "/login",
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
    return Buffer.from(crypto.getRandomValues(new Uint8Array(32)))
      .toString('hex')
  }
  
  static async exchangeCodeForToken(code: string, clientId: string) {
    // Implementeer code exchange logic
    // Dit vereist een auth code store
    
    // Voorbeeld implementatie:
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
interface AuthCode {
  code: string
  clientId: string
  userId: string
  scope: string
  expiresAt: number
}

async function getAuthCode(code: string): Promise<AuthCode | null> {
  // Implementeer auth code lookup
  // Dit kan in Redis, database, of memory store
  
  // Voorbeeld met memory store (niet voor productie!)
  const authCodes = new Map<string, AuthCode>()
  return authCodes.get(code) || null
}

// OIDC Endpoints die je moet implementeren
export const oidcEndpoints = {
  // /.well-known/openid-configuration endpoint
  async openidConfiguration() {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/api/auth/oauth/authorize`,
      token_endpoint: `${baseUrl}/api/auth/oauth/token`,
      userinfo_endpoint: `${baseUrl}/api/auth/oauth/userinfo`,
      jwks_uri: `${baseUrl}/api/auth/oauth/jwks`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      scopes_supported: ['openid', 'profile', 'email'],
      token_endpoint_auth_methods_supported: ['client_secret_basic'],
    }
  },
  
  // Token endpoint
  async tokenEndpoint(body: any) {
    const { grant_type, code, client_id, client_secret } = body
    
    if (grant_type === 'authorization_code') {
      const client = await OidcProvider.validateClient(client_id, client_secret)
      if (!client) {
        throw new Error('Invalid client')
      }
      
      return await OidcProvider.exchangeCodeForToken(code, client_id)
    }
    
    throw new Error('Unsupported grant type')
  },
  
  // Userinfo endpoint
  async userinfoEndpoint(accessToken: string) {
    try {
      const decoded = jwt.verify(accessToken, process.env.NEXTAUTH_SECRET!) as any
      
      // Haal user info op uit database
      // const user = await prisma.user.findUnique({
      //   where: { id: decoded.sub }
      // })
      
      // Voorbeeld user data
      const user = {
        id: decoded.sub,
        email: "user@example.com",
        name: "Example User",
        emailVerified: true,
        image: null,
        role: "user",
      }
      
      return {
        sub: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.emailVerified,
        picture: user.image,
        role: user.role,
      }
    } catch {
      throw new Error('Invalid access token')
    }
  },
}
