import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts"
import type { ServerFunctionClient } from "payload"

import configPromise from "@/payload/payload.config"
import importMap from "@/payload/importMap"

const serverFunction: ServerFunctionClient = (args) =>
  handleServerFunctions({
    config: configPromise,
    importMap,
    ...args,
  })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
