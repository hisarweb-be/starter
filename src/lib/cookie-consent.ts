const CONSENT_COOKIE = "cookie-consent"
const CONSENT_VERSION = "1"

export type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: string
}

const _defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: CONSENT_VERSION,
}

export function getConsent(): ConsentState | null {
  if (typeof document === "undefined") return null

  const raw = getCookie(CONSENT_COOKIE)
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentState
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function setConsent(consent: Omit<ConsentState, "necessary" | "version">): void {
  const state: ConsentState = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    version: CONSENT_VERSION,
  }

  const value = encodeURIComponent(JSON.stringify(state))
  const maxAge = 365 * 24 * 60 * 60
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function acceptAll(): void {
  setConsent({ analytics: true, marketing: true })
}

export function rejectAll(): void {
  setConsent({ analytics: false, marketing: false })
}

export function hasConsented(): boolean {
  return getConsent() !== null
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}
