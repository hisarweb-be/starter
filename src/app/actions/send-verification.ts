"use server"

import crypto from "crypto"

import { Resend } from "resend"

import { VerifyEmailEmail } from "@/emails/verify-email"
import { prisma } from "@/lib/server/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

const db = prisma as unknown as {
  user: {
    findUnique: (args: Record<string, unknown>) => Promise<{
      id: string
      email: string
      name: string | null
      emailVerified: boolean
    } | null>
  }
  emailVerificationToken: {
    create: (args: Record<string, unknown>) => Promise<unknown>
  }
}

export async function sendVerificationEmailAction(userId: string) {
  try {
    const user = await db.user.findUnique({ where: { id: userId } })

    if (!user) {
      return { success: false, message: "Gebruiker niet gevonden." }
    }

    if (user.emailVerified) {
      return { success: false, message: "E-mailadres is al geverifieerd." }
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await db.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    })

    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`
    const name = user.name ?? user.email

    await resend.emails.send({
      from: "HisarWeb <noreply@hisarweb.be>",
      to: user.email,
      subject: "Bevestig je e-mailadres",
      react: VerifyEmailEmail({ verifyUrl, name }),
    })

    return { success: true, message: "Verificatie-e-mail verzonden." }
  } catch (error) {
    console.error("[SEND_VERIFICATION]", error)
    return { success: false, message: "Er is een fout opgetreden." }
  }
}
