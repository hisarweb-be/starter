import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

import { auth } from "@/auth"
import { cloudinaryConfig, hasCloudinaryConfig } from "@/lib/cloudinary"

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
})

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json({ error: "Cloudinary is niet geconfigureerd." }, { status: 400 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "Geen bestand aangeleverd" }, { status: 400 })
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Bestand te groot (max 10MB)" }, { status: 400 })
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Ongeldig bestandstype" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await new Promise<{
      secure_url: string
      public_id: string
      width: number
      height: number
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `hisarweb/${session.user!.organizationId}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload mislukt"))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            else resolve(result as any)
          }
        )
        .end(buffer)
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error("[upload] Cloudinary fout:", error)
    return NextResponse.json({ error: "Upload mislukt" }, { status: 500 })
  }
}
