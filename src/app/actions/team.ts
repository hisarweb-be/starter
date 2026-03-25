"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"
import { hashPassword } from "@/lib/server/security"

export type TeamRole = "admin" | "editor" | "user"

export type TeamMemberRecord = {
  id: string
  email: string
  name: string | null
  role: string
  organizationId: string | null
  createdAt: Date
}

const db = prisma as unknown as {
  user: {
    findMany: (args: Record<string, unknown>) => Promise<TeamMemberRecord[]>
    findUnique: (args: Record<string, unknown>) => Promise<TeamMemberRecord | null>
    create: (args: Record<string, unknown>) => Promise<TeamMemberRecord>
    update: (args: Record<string, unknown>) => Promise<TeamMemberRecord>
    delete: (args: Record<string, unknown>) => Promise<TeamMemberRecord>
  }
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<{ id: string; ownerId: string } | null>
  }
}

async function getTeamContext() {
  const session = await auth()
  if (!session?.user?.organizationId || !session.user.id) {
    throw new Error("Not authenticated")
  }

  const organization = await db.organization.findUnique({
    where: { id: session.user.organizationId },
  })

  if (!organization) {
    throw new Error("Organization not found")
  }

  return {
    organizationId: session.user.organizationId,
    currentUserId: session.user.id,
    ownerId: organization.ownerId,
  }
}

function revalidateTeamViews() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/team")
  revalidatePath("/admin")
}

export async function inviteTeamMemberAction(input: {
  name: string
  email: string
  role: TeamRole
  password: string
}) {
  const { organizationId } = await getTeamContext()
  const email = input.email.trim().toLowerCase()

  const existing = await db.user.findUnique({
    where: { email },
  })

  if (existing) {
    throw new Error("Dit e-mailadres is al in gebruik.")
  }

  const passwordHash = await hashPassword(input.password)
  const member = await db.user.create({
    data: {
      name: input.name.trim(),
      email,
      role: input.role,
      passwordHash,
      organizationId,
    },
  })

  revalidateTeamViews()
  return member
}

export async function updateTeamMemberRoleAction(input: {
  userId: string
  role: TeamRole
}) {
  const { organizationId, ownerId } = await getTeamContext()
  const member = await db.user.findUnique({
    where: { id: input.userId },
  })

  if (!member || member.organizationId !== organizationId) {
    throw new Error("Teamlid niet gevonden.")
  }

  if (member.id === ownerId) {
    throw new Error("De eigenaarrol kan hier niet worden aangepast.")
  }

  const updated = await db.user.update({
    where: { id: input.userId },
    data: { role: input.role },
  })

  revalidateTeamViews()
  return updated
}

export async function removeTeamMemberAction(input: {
  userId: string
}) {
  const { organizationId, ownerId, currentUserId } = await getTeamContext()
  const member = await db.user.findUnique({
    where: { id: input.userId },
  })

  if (!member || member.organizationId !== organizationId) {
    throw new Error("Teamlid niet gevonden.")
  }

  if (member.id === ownerId) {
    throw new Error("De eigenaar kan niet worden verwijderd.")
  }

  if (member.id === currentUserId) {
    throw new Error("Je kunt jezelf niet verwijderen.")
  }

  await db.user.delete({
    where: { id: input.userId },
  })

  revalidateTeamViews()
  return { success: true }
}
