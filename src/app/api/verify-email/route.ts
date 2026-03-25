import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  emailVerificationToken: {
    findUnique: (args: Record<string, unknown>) => Promise<{
      id: string
      token: string
      userId: string
      expiresAt: Date
      usedAt: Date | null
    } | null>
    update: (args: Record<string, unknown>) => Promise<unknown>
  }
  user: {
    update: (args: Record<string, unknown>) => Promise<unknown>
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!token) {
    return NextResponse.redirect(new URL("/nl/login", request.url))
  }

  try {
    const record = await db.emailVerificationToken.findUnique({ where: { token } })

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/nl/login?error=invalid_token", request.url))
    }

    await db.user.update({ where: { id: record.userId }, data: { emailVerified: true } })
    await db.emailVerificationToken.update({ where: { token }, data: { usedAt: new Date() } })

    return NextResponse.redirect(new URL("/nl/dashboard?verified=true", request.url))
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error)
    return NextResponse.redirect(new URL("/nl/login?error=server_error", request.url))
  }
}
