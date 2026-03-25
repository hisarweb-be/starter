"use client"

import { useMemo, useState, useTransition } from "react"
import { ShieldCheck, Trash2, UserPlus, Users } from "lucide-react"

import {
  inviteTeamMemberAction,
  removeTeamMemberAction,
  updateTeamMemberRoleAction,
  type TeamMemberRecord,
  type TeamRole,
} from "@/app/actions/team"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type TeamManagerProps = {
  initialMembers: TeamMemberRecord[]
  currentUserId: string
  ownerId: string
}

const roleOptions: TeamRole[] = ["admin", "editor", "user"]

const roleLabels: Record<TeamRole, string> = {
  admin: "Admin",
  editor: "Editor",
  user: "Gebruiker",
}

export function TeamManager({
  initialMembers,
  currentUserId,
  ownerId,
}: TeamManagerProps) {
  const [members, setMembers] = useState(initialMembers)
  const [invite, setInvite] = useState({
    name: "",
    email: "",
    role: "editor" as TeamRole,
    password: "",
  })
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const stats = useMemo(() => {
    const admins = members.filter((member) => member.role === "admin").length
    const editors = members.filter((member) => member.role === "editor").length

    return [
      { label: "Teamleden", value: members.length },
      { label: "Admins", value: admins },
      { label: "Editors", value: editors },
    ]
  }, [members])

  function setSuccess(message: string) {
    setFeedback({ type: "success", message })
  }

  function setError(message: string) {
    setFeedback({ type: "error", message })
  }

  function handleInviteSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    startTransition(async () => {
      try {
        const newMember = await inviteTeamMemberAction(invite)
        setMembers((current) => [...current, newMember].sort(sortMembers))
        setInvite({
          name: "",
          email: "",
          role: "editor",
          password: "",
        })
        setSuccess("Teamlid toegevoegd. Deze gebruiker kan meteen inloggen met de ingestelde credentials.")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Uitnodigen is mislukt.")
      }
    })
  }

  function handleRoleChange(userId: string, role: TeamRole) {
    setFeedback(null)

    startTransition(async () => {
      try {
        const updated = await updateTeamMemberRoleAction({ userId, role })
        setMembers((current) =>
          current.map((member) => (member.id === updated.id ? updated : member)).sort(sortMembers)
        )
        setSuccess("Rol bijgewerkt.")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Rol aanpassen is mislukt.")
      }
    })
  }

  function handleRemove(userId: string) {
    setFeedback(null)

    startTransition(async () => {
      try {
        await removeTeamMemberAction({ userId })
        setMembers((current) => current.filter((member) => member.id !== userId))
        setSuccess("Teamlid verwijderd.")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Verwijderen is mislukt.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="surface-card rounded-[1.7rem] border-0 py-0">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
                <Users className="size-5" />
              </span>
              <div>
                <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="surface-card rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-primary text-primary-foreground">
                <UserPlus className="size-5" />
              </span>
              Nieuw teamlid
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Naam</Label>
                <Input
                  id="memberName"
                  value={invite.name}
                  onChange={(event) => setInvite((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Bijv. Sarah Demir"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberEmail">E-mail</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  value={invite.email}
                  onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))}
                  placeholder="sarah@bedrijf.nl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberRole">Rol</Label>
                <select
                  id="memberRole"
                  value={invite.role}
                  onChange={(event) =>
                    setInvite((current) => ({ ...current, role: event.target.value as TeamRole }))
                  }
                  className="flex h-11 w-full rounded-2xl border border-input bg-background/75 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberPassword">Tijdelijk wachtwoord</Label>
                <Input
                  id="memberPassword"
                  type="password"
                  value={invite.password}
                  onChange={(event) => setInvite((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimaal 8 tekens"
                  minLength={8}
                  required
                />
                <p className="text-xs leading-6 text-muted-foreground">
                  De gebruiker kan hiermee direct inloggen. Later kan dit via de reset-flow worden aangepast.
                </p>
              </div>

              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Toevoegen..." : "Teamlid toevoegen"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="surface-panel rounded-[1.9rem] border-0 py-0">
          <CardHeader className="space-y-3 px-5 pt-5 sm:px-6 sm:pt-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <span className="inline-flex size-11 items-center justify-center rounded-[1rem] bg-secondary text-secondary-foreground">
                <ShieldCheck className="size-5" />
              </span>
              Rollen & toegang
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="grid gap-4 rounded-[1.4rem] border border-border/60 bg-card/70 p-4 md:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-sm font-semibold text-foreground">Richtlijn voor beheer</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Houd slechts een klein aantal admins aan. Laat editors content beheren en gebruik gewone accounts voor meekijken of operationele taken.
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-border/60 bg-background/80 px-4 py-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                  Eigenaarschap
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  De eigenaar blijft beschermd: die rol kan niet worden verwijderd of gedegradeerd vanuit deze interface.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {members.map((member) => {
                const isOwner = member.id === ownerId
                const isCurrentUser = member.id === currentUserId

                return (
                  <div
                    key={member.id}
                    className="grid gap-3 rounded-[1.35rem] border border-border/60 bg-background/75 p-4 md:grid-cols-[minmax(0,1fr)_180px_auto]"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {member.name?.trim() || member.email}
                        </p>
                        {isOwner ? (
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            Eigenaar
                          </span>
                        ) : null}
                        {isCurrentUser ? (
                          <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-xs font-medium text-foreground">
                            Jij
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Actief sinds {new Date(member.createdAt).toLocaleDateString("nl-NL")}
                      </p>
                    </div>

                    <select
                      value={member.role as TeamRole}
                      onChange={(event) => handleRoleChange(member.id, event.target.value as TeamRole)}
                      disabled={isPending || isOwner}
                      className="h-11 rounded-2xl border border-input bg-card/80 px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      ))}
                    </select>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(member.id)}
                        disabled={isPending || isOwner || isCurrentUser}
                        className="h-11 rounded-2xl px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Verwijderen
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {feedback ? (
              <div
                className={cn(
                  "rounded-[1.2rem] px-4 py-3 text-sm",
                  feedback.type === "success"
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {feedback.message}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function sortMembers(a: TeamMemberRecord, b: TeamMemberRecord) {
  const roleOrder = { admin: 0, editor: 1, user: 2 }
  const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 3
  const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 3

  if (aOrder !== bOrder) {
    return aOrder - bOrder
  }

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
}
