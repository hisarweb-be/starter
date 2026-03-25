import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthCardProps = {
  eyebrow: string
  title: string
  description: string
}

export function AuthCard({ eyebrow, title, description }: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-xl border border-border/70 bg-card/90 shadow-sm">
        <CardHeader className="space-y-4">
          <Badge>{eyebrow}</Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl">{title}</CardTitle>
            <CardDescription className="text-base leading-7">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Continue</Button>
        </CardContent>
      </Card>
    </div>
  )
}
