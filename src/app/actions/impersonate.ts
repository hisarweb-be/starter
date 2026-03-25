"use server"

import { cookies } from "next/headers"
import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  organization: {
    findFirst: (args: Record<string, unknown>) => Promise<{ id: string; name: string; ownerId: string } | null>
  }
}

async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== "admin" && role !== "superadmin") throw new Error("Geen toegang")
  return session!
}

export async function startImpersonatingAction(orgId: string) {
  await requireAdmin()
  const org = await db.organization.findFirst({ where: { id: orgId } })
  if (!org) return { success: false, message: "Organisatie niet gevonden" }

  const cookieStore = await cookies()
  cookieStore.set("x-impersonate-org", orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 60, // 30 minuten
    path: "/",
    sameSite: "lax",
  })
  cookieStore.set("x-impersonate-org-name", org.name, {
    httpOnly: false, // leesbaar door client voor weergave
    maxAge: 30 * 60,
    path: "/",
    sameSite: "lax",
  })

  return { success: true, orgName: org.name }
}

export async function stopImpersonatingAction() {
  const cookieStore = await cookies()
  cookieStore.delete("x-impersonate-org")
  cookieStore.delete("x-impersonate-org-name")
  return { success: true }
}
