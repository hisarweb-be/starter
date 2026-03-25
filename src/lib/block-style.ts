import type React from "react"

export type BlockStyle = {
  bgColor?: string
  paddingY?: "none" | "sm" | "md" | "lg" | "xl"
  textAlign?: "left" | "center" | "right"
  darkBg?: boolean
  borderRadius?: "none" | "sm" | "lg" | "full"
}

const paddingMap: Record<NonNullable<BlockStyle["paddingY"]>, string> = {
  none: "py-0",
  sm: "py-4",
  md: "py-8",
  lg: "py-16",
  xl: "py-24",
}

const borderRadiusMap: Record<NonNullable<BlockStyle["borderRadius"]>, string> = {
  none: "",
  sm: "rounded-lg",
  lg: "rounded-2xl",
  full: "rounded-full",
}

export function getBlockWrapperClass(style?: BlockStyle): string {
  if (!style) return ""
  const parts: string[] = []
  if (style.paddingY && paddingMap[style.paddingY]) parts.push(paddingMap[style.paddingY])
  if (style.textAlign) parts.push(`text-${style.textAlign}`)
  if (style.darkBg) parts.push("bg-foreground text-background")
  if (style.borderRadius && borderRadiusMap[style.borderRadius]) parts.push(borderRadiusMap[style.borderRadius])
  return parts.join(" ")
}

export function getBlockWrapperStyle(style?: BlockStyle): React.CSSProperties {
  if (!style?.bgColor) return {}
  return { backgroundColor: style.bgColor }
}
