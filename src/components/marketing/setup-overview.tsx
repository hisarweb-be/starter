import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SetupStep = {
  title: string
  description: string
}

export function SetupOverview({
  eyebrow,
  title,
  description,
  steps,
}: {
  eyebrow: string
  title: string
  description: string
  steps: SetupStep[]
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16">
      <section className="space-y-4">
        <Badge>{eyebrow}</Badge>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <Card key={step.title} className="border border-border/70 bg-card/85">
            <CardHeader>
              <Badge variant="secondary">Stap {index + 1}</Badge>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Deze stap wordt in de volgende sprint omgezet naar een echte multi-step form flow.
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
