import { RootPage } from "@payloadcms/next/views"

import configPromise from "@/payload/payload.config"
import importMap from "@/payload/importMap"

export default function AdminSegmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <RootPage
      config={configPromise}
      importMap={importMap}
      params={params.then(({ segments }) => ({ segments: segments ?? [] }))}
      searchParams={searchParams as Promise<Record<string, string | string[]>>}
    />
  )
}
