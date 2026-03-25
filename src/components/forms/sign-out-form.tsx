import { signOut } from "@/auth"

export function SignOutForm() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut({ redirectTo: "/nl/login" })
      }}
    >
      <button className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
        Afmelden
      </button>
    </form>
  )
}
