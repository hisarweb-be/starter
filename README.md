# HisarWeb Starter

A deploy-ready, multilingual website starter kit built as a product foundation.  
Powered by **Next.js 15**, **Payload CMS**, **NextAuth**, **tRPC**, and **Prisma**.

---

## Features

### Frontend
- Locale-first routing with `next-intl` (NL/EN/FR/DE/TR)
- Branded homepage with hero, features, testimonials, and CTA sections
- **Visual Page Builder**: Create dynamic page layouts using Payload CMS Blocks (Hero, Features, Testimonials, Pricing, FAQ, etc.)
- **Theme Customizer**: Adjust border radius, shadows, and primary colors via Payload SiteConfig
- Homepage sections can be driven from the `settings` collection or via the new Page Builder with file-backed fallback content
- Marketing page shell/body content can be driven from the Payload `pages` collection with locale-aware fallback copy
- Dark/light theme with system preference detection
- Mobile-responsive navigation with hamburger menu
- Runtime Payload-backed content previews with fallback content
- Per-page SEO metadata and dynamic sitemap/robots
- Multi-tenant runtime branding via host/header tenant resolution

### Setup & Configuration
- 8-step setup wizard with Zod validation and browser persistence
- Cloudinary logo upload UI with signed uploads
- Setup locking after first install (admin-only re-access)
- Runtime site settings sourced from wizard config and Payload globals
- Demo-install seeding that writes realistic local fallback data, tenant definitions, and attempts DB/Payload seeding when available

### Authentication & Authorization
- NextAuth v5 credentials-based login
- Optional Google and GitHub OAuth providers (env-gated)
- Centralized role/permission matrix for admin, editor and user
- Locale-aware admin dashboard with operational statistics and effective permission visibility
- Dashboard visibility based on session role
- Callback-aware login redirection

### Backend & API
- Payload CMS with collections: Pages, Posts, Media, Services, Portfolio, FAQ, Settings, Users
- Payload globals: SiteConfig, Navigation, Footer — rendered live in frontend
- tRPC API routers: wizard, settings, content
- Prisma-backed persistence with JSON fallback for no-DB development
- Resend-backed transactional email (contact, registration, password reset)
- Cloudinary signed upload endpoint
- GitHub release update checker

### Delivery & Operations
- Standalone Docker build with multi-stage optimization
- Docker Compose with PostgreSQL service
- GitHub Actions CI (lint, typecheck, build, test, E2E)
- GitHub Actions Deploy (Vercel + Docker registry)
- Vercel configuration
- Security headers (X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy)
- Baseline PWA support via manifest and installable metadata
- Optional analytics integration for Google Analytics and Plausible
- Deterministic experimentation / A-B assignment helpers for product testing

### Testing
- Vitest unit coverage for core server/runtime helpers
- Playwright E2E coverage for critical public flows (redirect, contact, setup locking)

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/hisarweb/hisarweb-starter.git
cd hisarweb-starter
npm install --legacy-peer-deps

# Copy environment
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Seed demo installation data
npm run db:seed

# Start development
npm run dev

# Install browser for E2E tests
npx playwright install chromium
```

Open [http://localhost:3000](http://localhost:3000).
A demo-ready installation now includes local fallback seed data and, when a database is available, attempts to seed Payload content as well.

Quick smoke check after startup:
```bash
curl http://localhost:3000/api/health
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (standalone) |
| `npm run start` | Start the standalone production server with a stable repo-root `data/` directory |
| `npm run start:e2e` | Start the standalone server with Playwright-safe defaults (`127.0.0.1:3001`) |
| `npm run start:next` | Start via `next start` (unsupported with `output: standalone`, debug only) |
| `npm run data:reset` | Remove local fallback data before smoke/E2E runs |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript validation |
| `npm run verify` | Run lint, typecheck and build sequentially |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:headed` | Run Playwright E2E tests with a visible browser |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo installation data (local fallback + DB/Payload when available) |

---

## Demo Seeding

```bash
npm run db:seed
```

This command now:
- writes demo-ready local fallback files into `data/`
- seeds wizard credentials and example request activity
- writes reusable demo content for pages, posts, services, portfolio, FAQ, homepage sections, settings and tenant definitions
- attempts to seed Payload globals and collections when a database is available

Default demo credentials:
- NextAuth admin: `admin@hisarweb.be` / `change-me-now`
- Payload admin: `admin@hisarweb.be` / `change-me-now`
- Payload editor: `editor@hisarweb.be` / `change-me-now`

---

## Test Strategy

### Unit tests
```bash
npm run test
```

### Full verification
```bash
npm run verify
```

Run this sequential script when you want a reliable pre-release check on Windows as well. It avoids overlapping `typecheck` and `build` processes that can both touch `.next/types`.

### End-to-end tests
```bash
npx playwright install chromium
npm run test:e2e
```

Playwright resets local fallback data, builds the app and starts the standalone production server automatically through `npm run start:e2e`, so the critical public flows are verified against a production-like runtime without hitting the known `next start` + `output: standalone` warning.

### Windows / standalone notes
- Prefer `npm run start` for local production-like checks and let Playwright use `npm run start:e2e` automatically.
- Avoid `next start` in this project when using `output: "standalone"`; Next.js warns about this combination and the supported path is the standalone server wrapper.
- The wrappers keep JSON fallback persistence pinned to the repo-root `data/` directory, even when Next runs from `.next/standalone`.
- `npm run start:e2e` also defaults to `HOSTNAME=127.0.0.1`, `PORT=3001`, and `NEXT_TELEMETRY_DISABLED=1`, which makes CI and local Windows runs more predictable.
- If you want a different port or host for manual checks, set `PORT` and `HOSTNAME` explicitly before `npm run start`.

---

## Deployment

### Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set environment variables from `.env.example`
4. Deploy

### Docker

```bash
# Start with Docker Compose (includes PostgreSQL + persistent app data)
docker compose -f docker/docker-compose.yml up --build

# Or build standalone
docker build -f docker/Dockerfile -t hisarweb-starter .
docker run -p 3000:3000 --env-file .env hisarweb-starter
```

### VPS / Self-hosted

```bash
npm ci --legacy-peer-deps
npm run build
npm run start
```

`npm run start` launches the standalone server generated by Next.js through a tiny wrapper that keeps file-backed runtime data in the repo-root `data/` directory.
Ensure `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL` are set correctly.

Example smoke test (POSIX shell):
```bash
npm run data:reset
PORT=3000 HOSTNAME=127.0.0.1 npm run build
PORT=3000 HOSTNAME=127.0.0.1 npm run start
# in another terminal
curl http://127.0.0.1:3000/api/health
curl -X POST http://127.0.0.1:3000/api/contact \
  -H "content-type: application/json" \
  -d '{"name":"QA Agent","email":"qa@example.com","subject":"Smoke test","message":"Production-like contact flow verification from the standalone server."}'
```

Example smoke test (PowerShell):
```powershell
npm run data:reset
$env:PORT="3000"
$env:HOSTNAME="127.0.0.1"
npm run build
npm run start
# in another terminal
curl http://127.0.0.1:3000/api/health
```

Example smoke test (cmd.exe):
```bat
npm run data:reset
set PORT=3000 && set HOSTNAME=127.0.0.1 && npm run build
set PORT=3000 && set HOSTNAME=127.0.0.1 && npm run start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | Payload CMS encryption secret |
| `NEXTAUTH_SECRET` | Yes | NextAuth session secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app base URL used by runtime helpers and metadata |
| `NEXTAUTH_URL` | Prod | Full application URL |
| `PORT` | No | Port for the standalone server (`3000` by default) |
| `HOSTNAME` | No | Host binding for the standalone server (`0.0.0.0`/`127.0.0.1` depending on runtime) |
| `DATA_DIR` | No | Override the local JSON fallback data directory (defaults to repo-root `data/`) |
| `AUTH_TRUST_HOST` | Reverse proxy | Trust forwarded host headers in proxied environments |
| `NEXT_TELEMETRY_DISABLED` | No | Disable Next.js telemetry in CI or scripted local runs (`1` recommended) |
| `PLAYWRIGHT_BASE_URL` | No | Override the default E2E base URL (`http://127.0.0.1:3001`) |
| `AUTH_GOOGLE_ID` | No | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | No | Google OAuth client secret |
| `AUTH_GITHUB_ID` | No | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | No | GitHub OAuth client secret |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |
| `RESEND_API_KEY` | No | Resend email API key |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | No | Plausible domain value |
| `GITHUB_REPOSITORY` | No | GitHub repo for update checks |

---

## Architecture

```
hisarweb-starter/
├── prisma/              # Prisma schema and seed
├── docker/              # Dockerfile and Docker Compose
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (frontend)/  # Public locale-based pages
│   │   ├── (auth)/      # Auth pages (login, register, forgot)
│   │   ├── admin/       # Payload admin panel
│   │   ├── api/         # API routes (Payload, tRPC, auth, cloudinary)
│   │   └── actions/     # Server actions
│   ├── components/      # UI, layout, forms, marketing, wizard
│   ├── i18n/            # Internationalization config and messages
│   ├── lib/             # Shared utilities and server helpers
│   ├── payload/         # Payload collections, globals, config
│   ├── server/          # tRPC routers and context
│   └── types/           # TypeScript declarations
├── tests/               # Unit tests (Vitest)
└── .github/workflows/   # CI and deploy pipelines
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router, standalone) |
| CMS | Payload CMS 3.x |
| Auth | NextAuth v5 |
| API | tRPC v11 |
| Database | Prisma 7 + PostgreSQL |
| Styling | Tailwind CSS 4 + shadcn/ui |
| i18n | next-intl 4 |
| Email | Resend |
| Media | Cloudinary |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Deploy | Vercel / Docker |

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

Built by **HisarWeb Design** · [hisarweb.be](https://www.hisarweb.be)
