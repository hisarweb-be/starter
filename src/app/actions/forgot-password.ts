"use server"

import crypto from "crypto"

import { Resend } from "resend"

import { PasswordResetEmail } from "@/emails/password-reset"
import { prisma } from "@/lib/server/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

const db = prisma as unknown as {
  user: {
    findUnique: (args: Record<string, unknown>) => Promise<{ id: string; email: string; name: string | null } | null>
  }
  passwordResetToken: {
    create: (args: Record<string, unknown>) => Promise<unknown>
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } })

    // Always return success (don't reveal if email exists)
    if (!user) {
      return { success: true, message: "Als dit e-mailadres bekend is, ontvang je een link." }
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.passwordResetToken.create({ data: { token, email, expiresAt } })

    const resetUrl = `${process.env.NEXTAUTH_URL}/nl/reset-password?token=${token}`

    await resend.emails.send({
      from: "HisarWeb <noreply@hisarweb.be>",
      to: email,
      subject: "Wachtwoord opnieuw instellen",
      react: PasswordResetEmail({ resetUrl }),
    })

    return { success: true, message: "Als dit e-mailadres bekend is, ontvang je een link." }
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error)
    return { success: false, message: "Er is een fout opgetreden." }
  }
}
