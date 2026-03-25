import { env } from "@/lib/env"

export const cloudinaryConfig = {
  cloudName: env.cloudinaryCloudName,
  apiKey: env.cloudinaryApiKey,
  apiSecret: env.cloudinaryApiSecret,
}

export function hasCloudinaryConfig() {
  return Boolean(
    cloudinaryConfig.cloudName &&
      cloudinaryConfig.apiKey &&
      cloudinaryConfig.apiSecret
  )
}
