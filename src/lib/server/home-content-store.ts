import "server-only"

import { getDataPath } from "@/lib/data-dir"
import { defaultHomeContent } from "@/lib/home-content"
import { readJsonFile, writeJsonFile } from "@/lib/server/json-store"

const homeContentPath = getDataPath("homepage-content.json")

function cloneHomeContent() {
  return JSON.parse(JSON.stringify(defaultHomeContent)) as typeof defaultHomeContent
}

export async function getStoredHomeContent() {
  return readJsonFile<typeof defaultHomeContent>(homeContentPath, cloneHomeContent())
}

export async function writeStoredHomeContent(content = cloneHomeContent()) {
  await writeJsonFile(homeContentPath, content)
  return content
}

export { homeContentPath }
