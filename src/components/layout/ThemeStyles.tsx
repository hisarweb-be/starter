import { getRuntimeSiteSettings } from "@/lib/server/site-runtime"

const borderRadiusMap = {
  none: "0px",
  rounded: "0.5rem",
  full: "9999px",
} as const

const shadowMap = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
} as const

export async function ThemeStyles() {
  const settings = await getRuntimeSiteSettings()
  const { theme } = settings

  const borderRadius =
    borderRadiusMap[theme.borderRadius as keyof typeof borderRadiusMap] ??
    borderRadiusMap.rounded
  const shadow =
    shadowMap[theme.shadows as keyof typeof shadowMap] ?? shadowMap.sm

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
        :root {
          --radius: ${borderRadius};
          --theme-shadow: ${shadow};
          --primary: ${theme.primaryColor};
        }
      `,
      }}
    />
  )
}
