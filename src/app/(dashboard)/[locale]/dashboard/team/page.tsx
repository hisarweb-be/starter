import { redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { Users } from "lucide-react"

import { auth } from "@/auth"
import { EmptyState } from "@/components/ui/empty-state"
import { TeamManager } from "@/components/dashboard/team-manager"
import { PageHeader } from "@/components/dashboard/page-header"
import { isValidLocale } from "@/lib/site"
import { prisma } from "@/lib/server/prisma"

type TeamMemberRecord = {
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
  }
  organization: {
    findUnique: (args: Record<string, unknown>) => Promise<{ id: string; ownerId: string } | null>
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (isValidLocale(locale)) setRequestLocale(locale)

  const session = await auth()
  if (!session?.user?.organizationId || !session.user.id) {
    redirect(`/${locale}/login`)
  }

  const [organization, members] = await Promise.all([
    db.organization.findUnique({
      where: { id: session.user.organizationId },
    }),
    db.user.findMany({
      where: { organizationId: session.user.organizationId },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    }),
  ])

  if (!organization) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Nodig collega’s uit, bewaak rollen en houd eigenaarschap helder."
      />
      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nog geen teamleden"
          description="Nodig je eerste teamlid uit."
        />
      ) : (
        <TeamManager
          initialMembers={members}
          currentUserId={session.user.id}
          ownerId={organization.ownerId}
        />
      )}
    </div>
  )
}
