"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StaggerChildren, StaggerItem } from "@/components/ui/animated-presence"

import type { PricingBlockData } from "./types"

export function PricingBlockComponent({
  title,
  plans,
}: PricingBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      {title ? <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2> : null}
      <StaggerChildren className="grid gap-8 md:grid-cols-3">
        {plans?.map((plan, index) => (
          <StaggerItem key={`${plan.name}-${index}`}>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2 text-3xl font-bold">{plan.price}</div>
              </CardHeader>
              <CardContent className="grow">
                <ul className="space-y-2">
                  {plan.features?.map((feature, featureIndex) => (
                    <li key={`${plan.name}-feature-${featureIndex}`} className="text-sm">
                      ✓ {feature.feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              {plan.buttonText ? (
                <CardFooter>
                  <a
                    href={plan.buttonLink || "#"}
                    className="w-full rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {plan.buttonText}
                  </a>
                </CardFooter>
              ) : null}
            </Card>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  )
}
