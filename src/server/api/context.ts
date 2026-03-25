import { auth } from "@/auth"

export async function createTRPCContext() {
  const session = await auth()

  return {
    session,
    organizationId: session?.user?.organizationId ?? null,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
