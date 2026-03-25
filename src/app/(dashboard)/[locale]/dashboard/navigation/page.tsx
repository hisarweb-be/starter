import { setRequestLocale } from "next-intl/server"

import { PageHeader } from "@/components/dashboard/page-header"
import { NavigationEditor } from "@/components/dashboard/navigation-editor"
import { getFooterAction } from "@/app/actions/footer"
import { getNavigationAction } from "@/app/actions/navigation"
import { isValidLocale } from "@/lib/site"

export default async function NavigationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const [footerData, navigationData] = await Promise.all([
    getFooterAction(),
    getNavigationAction(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Navigatie & Footer"
        description="Beheer de menu-items en footer van je website."
      />
      <NavigationEditor initialFooter={footerData} initialNavigation={navigationData} />
    </div>
  )
}
