import path from "node:path"

export function getDataDir() {
  return process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : path.join(process.cwd(), "data")
}

export function getDataPath(...segments: string[]) {
  return path.join(getDataDir(), ...segments)
}
