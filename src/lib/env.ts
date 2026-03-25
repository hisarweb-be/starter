const getEnv = (key: string, fallback = "") => process.env[key] ?? fallback

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`❌ Critical environment variable missing in production: ${key}`)
    }
    // Development fallback with warning
    console.warn(`⚠️ Using development fallback for ${key}`)
    return `dev-${key.toLowerCase().replace("_", "-")}`
  }
  return value
}

export const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  appUrl: getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  databaseUrl: getEnv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/hisarweb"
  ),
  payloadSecret: requireEnv("PAYLOAD_SECRET"),
  nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
  resendApiKey: getEnv("RESEND_API_KEY"),
  cloudinaryCloudName: getEnv("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: getEnv("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: getEnv("CLOUDINARY_API_SECRET"),
  googleClientId: getEnv("AUTH_GOOGLE_ID"),
  googleClientSecret: getEnv("AUTH_GOOGLE_SECRET"),
  githubClientId: getEnv("AUTH_GITHUB_ID"),
  githubClientSecret: getEnv("AUTH_GITHUB_SECRET"),
  githubRepo: getEnv("GITHUB_REPOSITORY", "hisarweb/hisarweb-starter"),
  googleAnalyticsId: getEnv("NEXT_PUBLIC_GA_ID"),
  plausibleDomain: getEnv("NEXT_PUBLIC_PLAUSIBLE_DOMAIN"),
  marketingDashboardIssuer: getEnv("MARKETING_DASHBOARD_ISSUER", "https://marketing-dashboard-brown.vercel.app"),
  marketingDashboardClientId: getEnv("MARKETING_DASHBOARD_CLIENT_ID"),
  marketingDashboardClientSecret: getEnv("MARKETING_DASHBOARD_CLIENT_SECRET"),
  marketingDashboardScope: getEnv("MARKETING_DASHBOARD_SCOPE", "openid profile email"),
}
