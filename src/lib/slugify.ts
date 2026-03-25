/**
 * Convert any string to a URL-safe slug.
 * Handles diacritics, spaces, special characters.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (é → e, ü → u)
    .replace(/[^a-z0-9\s-]/g, "")   // Keep only letters, numbers, spaces, hyphens
    .replace(/\s+/g, "-")            // Spaces to hyphens
    .replace(/-+/g, "-")             // Multiple hyphens to one
    .replace(/^-|-$/g, "")           // Trim leading/trailing hyphens
    .substring(0, 60)
}

export function slugifyUnique(text: string, existingSlugs: string[]): string {
  const base = slugify(text)
  if (!existingSlugs.includes(base)) return base
  let i = 2
  while (existingSlugs.includes(`${base}-${i}`)) i++
  return `${base}-${i}`
}
