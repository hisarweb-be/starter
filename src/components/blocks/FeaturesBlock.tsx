"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeInWhenVisible, StaggerChildren, StaggerItem } from "@/components/ui/animated-presence"

import type { FeaturesBlockData } from "./types"

export function FeaturesBlockComponent({
  title,
  features,
}: FeaturesBlockData) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      {title ? (
        <FadeInWhenVisible>
          <h2 className="mb-12 text-center text-3xl font-bold">{title}</h2>
        </FadeInWhenVisible>
      ) : null}
      <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features?.map((feature, index) => (
          <StaggerItem key={`${feature.title}-${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  )
}
