import { setRequestLocale } from "next-intl/server"
import { Image } from "lucide-react"

import { listMediaAction } from "@/app/actions/media"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/dashboard/page-header"
import { MediaLibrary } from "@/components/dashboard/media-library"
import { isValidLocale } from "@/lib/site"

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const media = await listMediaAction().catch(() => [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media bibliotheek"
        description="Upload en beheer afbeeldingen voor je website."
      />
      {media.length === 0 ? (
        <EmptyState
          icon={Image}
          title="Nog geen media"
          description="Upload je eerste afbeelding of bestand."
        />
      ) : (
        <MediaLibrary initialMedia={media} mode="manage" />
      )}
    </div>
  )
}
