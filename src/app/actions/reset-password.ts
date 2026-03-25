"use server"

import { prisma } from "@/lib/server/prisma"
import { hashPassword } from "@/lib/server/security"

const db = prisma as unknown as {
  passwordResetToken: {
    findUnique: (args: Record<string, unknown>) => Promise<{
      id: string
      email: string
      expiresAt: Date
      usedAt: Date | null
    } | null>
    update: (args: Record<string, unknown>) => Promise<unknown>
  }
  user: {
    update: (args: Record<string, unknown>) => Promise<unknown>
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  if (!token || newPassword.length < 8) {
    return { success: false, message: "Ongeldige invoer." }
  }

  const record = await db.passwordResetToken.findUnique({ where: { token } })

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { success: false, message: "Link is verlopen of al gebruikt." }
  }

  const passwordHash = await hashPassword(newPassword)

  await db.user.update({ where: { email: record.email }, data: { passwordHash } })
  await db.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } })

  return { success: true }
}
