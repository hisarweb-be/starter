import "server-only"

import { prisma } from "@/lib/server/prisma"

const GITHUB_REPO = "hisarweb-be/starter"
const GITHUB_API_URL = "https://api.github.com"

/**
 * Fetch the latest release from GitHub API
 * Falls back to database cache if API is unavailable
 */
export async function getLatestReleaseInfo() {
  try {
    // Try to fetch from GitHub API
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add GitHub token if available for higher rate limits
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
          }),
        },
        // Cache for 1 hour
        next: { revalidate: 3600 },
      }
    )

    if (response.ok) {
      const release = await response.json()

      // Save to database for fallback
      const db = prisma as unknown as {
        latestRelease: {
          upsert: (args: {
            where: { id: string }
            update: Record<string, unknown>
            create: Record<string, unknown>
          }) => Promise<{ id: string; tag: string }>
        }
      }

      const saved = await db.latestRelease.upsert({
        where: { id: "singleton" },
        update: {
          tag: release.tag_name,
          releaseNotes: release.body || null,
          releaseUrl: release.html_url || null,
          downloadUrl: release.assets?.[0]?.browser_download_url || null,
          checkedAt: new Date(),
        },
        create: {
          id: "singleton",
          tag: release.tag_name,
          releaseNotes: release.body || null,
          releaseUrl: release.html_url || null,
          downloadUrl: release.assets?.[0]?.browser_download_url || null,
          checkedAt: new Date(),
        },
      })

      return {
        tag: saved.tag,
        releaseNotes: release.body || null,
        releaseUrl: release.html_url || null,
        downloadUrl: release.assets?.[0]?.browser_download_url || null,
      }
    }
  } catch (error) {
    console.warn("[Release Checker] Failed to fetch from GitHub:", error)
  }

  // Fall back to database cache
  try {
    const db = prisma as unknown as {
      latestRelease: {
        findUnique: (args: { where: { id: string } }) => Promise<{
          tag: string
          releaseNotes: string | null
          releaseUrl: string | null
          downloadUrl: string | null
        } | null>
      }
    }

    const cached = await db.latestRelease.findUnique({
      where: { id: "singleton" },
    })

    if (cached) {
      return cached
    }
  } catch (error) {
    console.warn("[Release Checker] Failed to fetch from cache:", error)
  }

  return null
}

/**
 * Compare current version with latest release
 * Returns true if an update is available
 */
export async function isUpdateAvailable(currentVersion: string): Promise<boolean> {
  const latest = await getLatestReleaseInfo()

  if (!latest) {
    return false
  }

  // Simple version comparison: just check if tags are different
  // Remove 'v' prefix if present
  const cleanCurrent = currentVersion.replace(/^v/, "")
  const cleanLatest = latest.tag.replace(/^v/, "")

  return cleanCurrent !== cleanLatest
}

/**
 * Format changelog: take first 300 characters or first paragraph
 */
export function formatChangelog(rawChangelog: string | null): string {
  if (!rawChangelog) {
    return ""
  }

  // Get first paragraph (text before first \n\n or \n#)
  const paragraph = rawChangelog
    .split(/\n\n|\n#+/)[0]
    .trim()
    .substring(0, 300)

  return paragraph
}
