# Marketing Dashboard OIDC Provider Setup

Deze gids helpt je om je marketing-dashboard te configureren als OIDC provider voor de applet.

## 1. NextAuth OIDC Provider Configuratie

Voeg deze configuratie toe aan je marketing-dashboard `auth.ts`:

```typescript
import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
// ... je bestaande imports

export const authConfig: NextAuthConfig = {
  providers: [
    // Je bestaande providers (Credentials, Google, GitHub, etc.)
  ],
  
  // OIDC Provider configuratie
  experimental: {
    enableOidcProvider: true,
  },
  
  callbacks: {
    // Je bestaande callbacks
    
    // Voeg OIDC-specifieke callbacks toe
    async jwt({ token, user, account }) {
      if (account?.provider === "oidc") {
        token.oidc = true
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    
    async session({ session, token }) {
      if (token.oidc) {
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
        session.expiresAt = token.expiresAt as number
      }
      return session
    },
  },
  
  // OIDC specifieke configuratie
  oidc: {
    // Standaard OIDC endpoints worden automatisch gegenereerd
    issuer: process.env.NEXTAUTH_URL,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

## 2. Environment Variables voor Marketing Dashboard

Voeg deze toe aan je marketing-dashboard `.env`:

```env
# Basis NextAuth configuratie
NEXTAUTH_URL=https://marketing-dashboard-brown.vercel.app
NEXTAUTH_SECRET=je-sterke-secret-hier

# OIDC Provider configuratie
OIDC_CLIENT_ID=marketing-dashboard-internal
OIDC_CLIENT_SECRET=je-oidc-secret-hier

# Optionele OIDC settings
OIDC_ISSUER=https://marketing-dashboard-brown.vercel.app
OIDC_SCOPE=openid profile email
OIDC_RESPONSE_TYPE=code
OIDC_GRANT_TYPE=authorization_code
```

## 3. Client Database Tabel

Maak een OIDC clients tabel in je database:

```sql
-- Voeg toe aan je bestaande database schema
CREATE TABLE oidc_clients (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  redirect_uris TEXT[] NOT NULL,
  scope VARCHAR(500) DEFAULT 'openid profile email',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Voeg de applet client toe
INSERT INTO oidc_clients (
  client_id, 
  client_secret, 
  name, 
  redirect_uris, 
  scope
) VALUES (
  'applet-client',
  'je-applet-client-secret-hier',
  'HisarWeb Applet',
  ARRAY['http://localhost:3000/api/auth/callback/marketing-dashboard'],
  'openid profile email'
);
```

## 4. OIDC Endpoints

Je marketing-dashboard zal automatisch deze endpoints beschikbaar stellen:

- **Discovery**: `/.well-known/openid-configuration`
- **Authorization**: `/api/auth/oauth/authorize`
- **Token**: `/api/auth/oauth/token`
- **Userinfo**: `/api/auth/oauth/userinfo`
- **JWKS**: `/api/auth/oauth/jwks`

## 5. Client Validatie Middleware

Maak een middleware om OIDC clients te valideren:

```typescript
// middleware/oidc-client-validator.ts
import { NextRequest, NextResponse } from 'next/server'

export async function validateOidcClient(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('client_id')
  const redirectUri = request.nextUrl.searchParams.get('redirect_uri')
  
  // Valideer client in database
  const client = await getOidcClient(clientId)
  
  if (!client) {
    return NextResponse.json(
      { error: 'invalid_client' },
      { status: 401 }
    )
  }
  
  if (!client.redirect_uris.includes(redirectUri)) {
    return NextResponse.json(
      { error: 'invalid_redirect_uri' },
      { status: 400 }
    )
  }
  
  return null // Validatie succesvol
}

async function getOidcClient(clientId: string) {
  // Implementeer database lookup
  // Voorbeeld met Prisma:
  return await prisma.oidcClient.findUnique({
    where: { client_id: clientId }
  })
}
```

## 6. Applet Environment Variables

In je applet `.env` bestand:

```env
# Marketing Dashboard OIDC Client
MARKETING_DASHBOARD_ISSUER=https://marketing-dashboard-brown.vercel.app
MARKETING_DASHBOARD_CLIENT_ID=applet-client
MARKETING_DASHBOARD_CLIENT_SECRET=je-applet-client-secret-hier
MARKETING_DASHBOARD_SCOPE=openid profile email

# Applet specifiek
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=applet-secret-hier
AUTH_TRUST_HOST=true
```

## 7. Testen van de OIDC Flow

1. **Start beide applicaties**:
   ```bash
   # Marketing dashboard
   npm run dev
   
   # Applet
   cd C:\pi\project\starter\project
   npm run dev
   ```

2. **Test OIDC Discovery**:
   ```bash
   curl https://marketing-dashboard-brown.vercel.app/.well-known/openid-configuration
   ```

3. **Test Login Flow**:
   - Ga naar `http://localhost:3000/nl/login`
   - Klik op "Login met Marketing Dashboard"
   - Je wordt doorgestuurd naar het marketing-dashboard
   - Na login keer je terug naar de applet

## 8. Security Consideraties

- **HTTPS**: Zorg dat beide applicaties HTTPS gebruiken in productie
- **Secrets**: Gebruik sterke, unieke secrets voor elke client
- **Scope**: Beperk de scope tot wat strikt noodzakelijk is
- **Redirect URIs**: Valideer altijd de redirect URIs
- **Token Expiry**: Stel redelijke expiry times in
- **Rate Limiting**: Implementeer rate limiting op OIDC endpoints

## 9. Troubleshooting

### Common Issues

1. **CORS Errors**: Zorg dat `AUTH_TRUST_HOST=true` is ingesteld
2. **Invalid Client**: Check client_id en client_secret
3. **Redirect URI Mismatch**: Controleer redirect_uris in database
4. **Token Errors**: Verifieer NEXTAUTH_URL is correct

### Debug Mode

Voeg toe aan je environment:
```env
NEXTAUTH_DEBUG=true
OIDC_DEBUG=true
```

## 10. Productie Deployment

Voor Vercel deployment:

1. **Environment Variables** instellen in Vercel dashboard
2. **Database** met OIDC clients tabel
3. **Domain verification** voor beide applicaties
4. **HTTPS** automatisch via Vercel
5. **Monitoring** voor OIDC endpoints

Deze configuratie maakt je marketing-dashboard een volwaardige OIDC provider die veilige cross-domain authenticatie mogelijk maakt voor je applet.
