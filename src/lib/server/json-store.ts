import "server-only"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true })
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDir(filePath)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
}
