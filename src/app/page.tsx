import { redirect } from "next/navigation"

import { defaultLocale } from "@/lib/site"

export default function IndexPage() {
  redirect(`/${defaultLocale}`)
}
