import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string
      role?: string
      organizationId?: string
    }
    isImpersonating?: boolean
  }

  interface User {
    id?: string
    role?: string
    organizationId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    organizationId?: string
  }
}
