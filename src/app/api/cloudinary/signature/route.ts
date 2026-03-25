import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

import { auth } from "@/auth"
import { cloudinaryConfig, hasCloudinaryConfig } from "@/lib/cloudinary"
import { canManageSetup } from "@/lib/server/authorization-server"

export async function POST(request: Request) {
  const setupComplete = process.env.NEXT_PUBLIC_SETUP_COMPLETE === "true"
  const session = await auth()
  const hasAccess = await canManageSetup(session)

  if (!hasAccess && setupComplete) {
    return NextResponse.json(
      { error: "You are not allowed to manage setup uploads." },
      { status: 403 }
    )
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured." },
      { status: 400 }
    )
  }

  const body = (await request.json().catch(() => ({}))) as {
    folder?: string
    publicId?: string
  }

  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  })

  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign: Record<string, string | number> = {
    timestamp,
  }

  if (body.folder) paramsToSign.folder = body.folder
  if (body.publicId) paramsToSign.public_id = body.publicId

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinaryConfig.apiSecret
  )

  return NextResponse.json({
    cloudName: cloudinaryConfig.cloudName,
    apiKey: cloudinaryConfig.apiKey,
    timestamp,
    signature,
    folder: body.folder ?? null,
    publicId: body.publicId ?? null,
  })
}
