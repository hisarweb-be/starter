import { env } from "@/lib/env"

type ReleaseInfo = {
  currentVersion: string
  latestVersion: string | null
  updateAvailable: boolean
  releaseUrl: string | null
}

export function getReleaseFeedUrl() {
  return `https://api.github.com/repos/${env.githubRepo}/releases/latest`
}

export async function checkForUpdates(): Promise<ReleaseInfo> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const currentVersion = require("../../package.json").version as string

  try {
    const response = await fetch(getReleaseFeedUrl(), {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return {
        currentVersion,
        latestVersion: null,
        updateAvailable: false,
        releaseUrl: null,
      }
    }

    const data = (await response.json()) as {
      tag_name?: string
      html_url?: string
    }

    const latestVersion = data.tag_name?.replace(/^v/, "") ?? null
    const releaseUrl = data.html_url ?? null

    return {
      currentVersion,
      latestVersion,
      updateAvailable: latestVersion !== null && latestVersion !== currentVersion,
      releaseUrl,
    }
  } catch {
    return {
      currentVersion,
      latestVersion: null,
      updateAvailable: false,
      releaseUrl: null,
    }
  }
}
