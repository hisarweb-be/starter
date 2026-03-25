# Simpele OIDC Setup voor Marketing Dashboard

## Stap 1: Installeer benodigde packages in marketing dashboard

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

## Stap 2: Pas je marketing dashboard auth.ts aan

```typescript
// src/auth.ts in marketing dashboard
import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import jwt from "jsonwebtoken"

// Simpele client store (voor development - vervang met database in productie)
const OIDC_CLIENTS = {
  "applet-client": {
    client_secret: process.env.APPLET_CLIENT_SECRET || "dev-applet-secret",
    name: "HisarWeb Applet",
    redirect_uris: [
      "http://localhost:3000/api/auth/callback/marketing-dashboard",
      "https://your-applet-domain.vercel.app/api/auth/callback/marketing-dashboard"
    ],
    scope: "openid profile email"
  }
}

// Authorization codes store (gebruik Redis of database in productie)
const AUTH_CODES = new Map<string, {
  clientId: string
  userId: string
  scope: string
  expiresAt: number
}>()

export const authConfig: NextAuthConfig = {
  providers: [
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
        
        // Je bestaande user validatie logic
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
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user"
      }
      return token
    },
    
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

// OIDC Helper functies
export function generateAuthCode(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

export function validateOidcClient(clientId: string, clientSecret?: string) {
  const client = OIDC_CLIENTS[clientId as keyof typeof OIDC_CLIENTS]
  if (!client) return null
  
  if (clientSecret && client.client_secret !== clientSecret) {
    return null
  }
  
  return client
}

export function validateRedirectUri(clientId: string, redirectUri: string) {
  const client = OIDC_CLIENTS[clientId as keyof typeof OIDC_CLIENTS]
  if (!client) return false
  
  return client.redirect_uris.includes(redirectUri)
}

export function createAuthCode(clientId: string, userId: string, scope: string) {
  const code = generateAuthCode()
  AUTH_CODES.set(code, {
    clientId,
    userId,
    scope,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minuten
  })
  return code
}

export function exchangeCodeForToken(code: string, clientId: string) {
  const authCode = AUTH_CODES.get(code)
  if (!authCode || authCode.clientId !== clientId) {
    throw new Error('Invalid authorization code')
  }
  
  if (authCode.expiresAt < Date.now()) {
    AUTH_CODES.delete(code)
    throw new Error('Authorization code expired')
  }
  
  AUTH_CODES.delete(code)
  
  // Generate tokens
  const accessToken = jwt.sign(
    {
      sub: authCode.userId,
      aud: clientId,
      scope: authCode.scope,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 uur
    },
    process.env.NEXTAUTH_SECRET!
  )
  
  const refreshToken = jwt.sign(
    {
      sub: authCode.userId,
      aud: clientId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 dagen
    },
    process.env.NEXTAUTH_SECRET!
  )
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: authCode.scope,
  }
}

export function getUserFromToken(accessToken: string) {
  try {
    const decoded = jwt.verify(accessToken, process.env.NEXTAUTH_SECRET!) as any
    
    // Voorbeeld user data - haal dit uit je database
    return {
      id: decoded.sub,
      email: "user@example.com",
      name: "Example User",
      emailVerified: true,
      image: null,
      role: "user",
    }
  } catch {
    return null
  }
}
```

## Stap 3: Maak OIDC API routes in marketing dashboard

```typescript
// src/app/api/auth/oauth/.well-known/openid-configuration/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  return NextResponse.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/auth/oauth/authorize`,
    token_endpoint: `${baseUrl}/api/auth/oauth/token`,
    userinfo_endpoint: `${baseUrl}/api/auth/oauth/userinfo`,
    jwks_uri: `${baseUrl}/api/auth/oauth/jwks`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    scopes_supported: ['openid', 'profile', 'email'],
    token_endpoint_auth_methods_supported: ['client_secret_basic'],
  })
}
```

```typescript
// src/app/api/auth/oauth/authorize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateOidcClient, validateRedirectUri, createAuthCode } from '@/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const scope = searchParams.get('scope') || 'openid profile email'
  const responseType = searchParams.get('response_type')
  
  // Valideer parameters
  if (!clientId || !redirectUri || responseType !== 'code') {
    return NextResponse.json(
      { error: 'invalid_request' },
      { status: 400 }
    )
  }
  
  // Valideer client
  const client = validateOidcClient(clientId)
  if (!client) {
    return NextResponse.json(
      { error: 'invalid_client' },
      { status: 401 }
    )
  }
  
  // Valideer redirect URI
  if (!validateRedirectUri(clientId, redirectUri)) {
    return NextResponse.json(
      { error: 'invalid_redirect_uri' },
      { status: 400 }
    )
  }
  
  // Check if user is authenticated
  const session = await auth()
  if (!session?.user) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // Create authorization code
  const authCode = createAuthCode(clientId, session.user.id, scope)
  
  // Redirect back with code
  const redirectUrl = new URL(redirectUri)
  redirectUrl.searchParams.set('code', authCode)
  redirectUrl.searchParams.set('state', searchParams.get('state') || '')
  
  return NextResponse.redirect(redirectUrl)
}
```

```typescript
// src/app/api/auth/oauth/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateOidcClient, exchangeCodeForToken } from '@/auth'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const grantType = formData.get('grant_type') as string
  const code = formData.get('code') as string
  const clientId = formData.get('client_id') as string
  const clientSecret = formData.get('client_secret') as string
  
  if (grantType !== 'authorization_code' || !code || !clientId) {
    return NextResponse.json(
      { error: 'invalid_request' },
      { status: 400 }
    )
  }
  
  // Valideer client
  const client = validateOidcClient(clientId, clientSecret)
  if (!client) {
    return NextResponse.json(
      { error: 'invalid_client' },
      { status: 401 }
    )
  }
  
  try {
    const tokens = exchangeCodeForToken(code, clientId)
    return NextResponse.json(tokens)
  } catch (error) {
    return NextResponse.json(
      { error: 'invalid_grant' },
      { status: 400 }
    )
  }
}
```

```typescript
// src/app/api/auth/oauth/userinfo/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/auth'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'invalid_token' },
      { status: 401 }
    )
  }
  
  const accessToken = authHeader.substring(7)
  const user = getUserFromToken(accessToken)
  
  if (!user) {
    return NextResponse.json(
      { error: 'invalid_token' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({
    sub: user.id,
    email: user.email,
    name: user.name,
    email_verified: user.emailVerified,
    picture: user.image,
    role: user.role,
  })
}
```

## Stap 4: Environment variables voor marketing dashboard

```env
# In je marketing dashboard .env
NEXTAUTH_URL=https://marketing-dashboard-brown.vercel.app
NEXTAUTH_SECRET=je-sterke-secret-hier

# OIDC Client voor applet
APPLET_CLIENT_SECRET=je-unieke-applet-secret-hier
```

## Stap 5: Test de OIDC flow

1. Start marketing dashboard
2. Test discovery endpoint:
   ```bash
   curl https://marketing-dashboard-brown.vercel.app/api/auth/oauth/.well-known/openid-configuration
   ```
3. Test authorization flow via applet

Deze setup geeft je een werkende OIDC provider die je kunt gebruiken voor cross-domain authenticatie!
