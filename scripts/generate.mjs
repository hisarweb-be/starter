#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"
import { createInterface } from "readline"

const rl = createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((resolve) => rl.question(q, resolve))

const SRC = join(import.meta.dirname, "..", "src")

const templates = {
  block: (name, pascalName) => ({
    component: `import type { ${pascalName}BlockData } from "./types"

export function ${pascalName}BlockComponent({ title }: ${pascalName}BlockData) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title && <h2 className="mb-12 text-center font-display text-3xl font-bold">{title}</h2>}
      <div className="rounded-3xl border-2 border-dashed py-12 text-center text-muted-foreground">
        ${pascalName} block content
      </div>
    </section>
  )
}
`,
    types: `
export type ${pascalName}BlockData = {
  blockType: "${name}"
  title?: string | null
}
`,
  }),

  page: (name, pascalName) => `import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { isValidLocale } from "@/lib/site"

export default async function ${pascalName}Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">${pascalName}</h1>
        <p className="text-sm text-muted-foreground">Beschrijving hier</p>
      </div>
    </div>
  )
}
`,
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")
}

async function generateBlock() {
  const name = await ask("Block type naam (kebab-case, bijv. 'image-slider'): ")
  const pascalName = toPascalCase(name)
  const t = templates.block(name, pascalName)

  const componentPath = join(SRC, "components", "blocks", `${pascalName}Block.tsx`)
  if (existsSync(componentPath)) {
    console.log(`\x1b[31mFout: ${componentPath} bestaat al\x1b[0m`)
    return
  }

  writeFileSync(componentPath, t.component)
  console.log(`\x1b[32mAangemaakt:\x1b[0m ${componentPath}`)
  console.log(`\n\x1b[33mVolgende stappen:\x1b[0m`)
  console.log(`1. Voeg het type toe aan src/components/blocks/types.ts:`)
  console.log(t.types)
  console.log(`2. Voeg een case toe aan src/components/RenderBlocks.tsx:`)
  console.log(`   case "${name}": return <${pascalName}BlockComponent key={key} {...(block as ${pascalName}BlockData)} />`)
  console.log(`3. Voeg ${pascalName}BlockData toe aan de RenderablePageBlock union type`)
}

async function generatePage() {
  const name = await ask("Pagina naam (kebab-case, bijv. 'analytics'): ")
  const pascalName = toPascalCase(name)
  const group = await ask("Route groep (dashboard/admin/frontend) [dashboard]: ") || "dashboard"

  let dir
  if (group === "frontend") {
    dir = join(SRC, "app", "(frontend)", "[locale]", name)
  } else if (group === "admin") {
    dir = join(SRC, "app", "(dashboard)", "[locale]", "admin", name)
  } else {
    dir = join(SRC, "app", "(dashboard)", "[locale]", "dashboard", name)
  }

  mkdirSync(dir, { recursive: true })
  const pagePath = join(dir, "page.tsx")

  if (existsSync(pagePath)) {
    console.log(`\x1b[31mFout: ${pagePath} bestaat al\x1b[0m`)
    return
  }

  writeFileSync(pagePath, templates.page(name, pascalName))
  console.log(`\x1b[32mAangemaakt:\x1b[0m ${pagePath}`)

  if (group !== "frontend") {
    console.log(`\n\x1b[33mVolgende stap:\x1b[0m Voeg een nav item toe in src/components/dashboard/sidebar.tsx`)
  }
}

async function main() {
  const type = process.argv[2]

  if (!type || !["block", "page"].includes(type)) {
    console.log("Gebruik: node scripts/generate.mjs <type>")
    console.log("  Types: block, page")
    rl.close()
    return
  }

  if (type === "block") await generateBlock()
  if (type === "page") await generatePage()

  rl.close()
}

main().catch(console.error)
