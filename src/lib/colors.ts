/**
 * Color utilities for theme generation.
 * Given a primary hex color, generates a harmonious palette.
 */

export type ColorPalette = {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  accent: string
  suggestions: string[]
}

/**
 * Converts hex to HSL components
 */
export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function hslToHex(h: number, s: number, l: number): string {
  const a = (s * Math.min(l, 100 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round((255 * color) / 100)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * Generate a palette from a single primary color
 */
export function generatePalette(primaryHex: string): ColorPalette {
  const [h, s, l] = hexToHsl(primaryHex)

  return {
    primary: primaryHex,
    primaryLight: hslToHex(h, Math.max(s - 10, 0), Math.min(l + 20, 95)),
    primaryDark: hslToHex(h, Math.min(s + 10, 100), Math.max(l - 20, 5)),
    secondary: hslToHex((h + 180) % 360, s * 0.6, l * 1.1),
    accent: hslToHex((h + 30) % 360, s * 0.8, l),
    suggestions: [
      hslToHex(h, s, l), // original
      hslToHex((h + 15) % 360, s, l),
      hslToHex((h + 30) % 360, s, l),
      hslToHex((h + 60) % 360, s, l),
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 180) % 360, s, l),
      hslToHex((h + 210) % 360, s, l),
      hslToHex((h + 270) % 360, s, l),
    ],
  }
}

/**
 * Predefined HisarWeb brand palettes
 */
export const brandPalettes = [
  { name: "HisarWeb Violet", color: "#6d28d9" },
  { name: "Ocean Blue", color: "#0ea5e9" },
  { name: "Forest Green", color: "#16a34a" },
  { name: "Sunset Orange", color: "#ea580c" },
  { name: "Rose Pink", color: "#e11d48" },
  { name: "Midnight", color: "#1e293b" },
  { name: "Amber Gold", color: "#d97706" },
  { name: "Teal", color: "#0d9488" },
]

/**
 * Google Fonts presets
 */
export const fontPresets = [
  { id: "geist", label: "Geist (Modern)" },
  { id: "inter", label: "Inter (Clean)" },
  { id: "poppins", label: "Poppins (Friendly)" },
  { id: "playfair", label: "Playfair Display (Elegant)" },
  { id: "lato", label: "Lato (Professional)" },
  { id: "roboto", label: "Roboto (Tech)" },
  { id: "montserrat", label: "Montserrat (Bold)" },
  { id: "merriweather", label: "Merriweather (Editorial)" },
]
