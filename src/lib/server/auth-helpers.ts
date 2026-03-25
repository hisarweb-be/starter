import "server-only"

import { env } from "@/lib/env"

export function getEnabledSocialProviders() {
  const providers: Array<"google" | "github"> = []

  if (env.googleClientId && env.googleClientSecret) {
    providers.push("google")
  }

  if (env.githubClientId && env.githubClientSecret) {
    providers.push("github")
  }

  return providers
}
