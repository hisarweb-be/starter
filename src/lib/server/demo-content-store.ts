import "server-only"

import { getDataPath } from "@/lib/data-dir"
import { defaultDemoContent, type DemoContent } from "@/lib/demo-content"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"

const demoContentPath = getDataPath("demo-content.json")

function cloneDemoContent() {
  return JSON.parse(JSON.stringify(defaultDemoContent)) as DemoContent
}

export async function getDemoContent() {
  return readJsonFile<DemoContent>(demoContentPath, cloneDemoContent())
}

export async function writeDemoContent(content: DemoContent = cloneDemoContent()) {
  await writeJsonFile(demoContentPath, content)
  return content
}

export { demoContentPath }
