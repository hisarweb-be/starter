import "server-only"

export async function withPersistenceFallback<T>({
  primary,
  fallback,
}: {
  primary: () => Promise<T>
  fallback: () => Promise<T>
}) {
  try {
    return await primary()
  } catch {
    return fallback()
  }
}
