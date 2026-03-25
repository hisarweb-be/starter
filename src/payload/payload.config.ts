import path from "path"
import { fileURLToPath } from "url"

import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { buildConfig } from "payload"

import FAQ from "@/payload/collections/FAQ"
import Media from "@/payload/collections/Media"
import Pages from "@/payload/collections/Pages"
import Portfolio from "@/payload/collections/Portfolio"
import Posts from "@/payload/collections/Posts"
import Services from "@/payload/collections/Services"
import Settings from "@/payload/collections/Settings"
import Users from "@/payload/collections/Users"
import Footer from "@/payload/globals/Footer"
import Navigation from "@/payload/globals/Navigation"
import SiteConfig from "@/payload/globals/SiteConfig"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, ".."),
    },
  },
  collections: [Users, Pages, Posts, Media, Services, Portfolio, FAQ, Settings],
  globals: [SiteConfig, Navigation, Footer],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? "dev-payload-secret",
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/hisarweb",
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, "../payload-types.ts"),
  },
})
