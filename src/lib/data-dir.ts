import path from "node:path"

export function getDataDir() {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR)

  // Vercel serverless has a read-only filesystem except /tmp
  if (process.env.VERCEL) return "/tmp/data"

  return path.join(process.cwd(), "data")
}

export function getDataPath(...segments: string[]) {
  return path.join(getDataDir(), ...segments)
}
