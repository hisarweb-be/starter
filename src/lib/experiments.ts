import { createHash } from "node:crypto"

export type ExperimentDefinition = {
  id: string
  description: string
  variants: string[]
}

export const experimentCatalog: ExperimentDefinition[] = [
  {
    id: "homepage-hero-copy",
    description: "Test different homepage hero positioning messages per audience.",
    variants: ["control", "product-led", "agency-led"],
  },
  {
    id: "dashboard-release-card",
    description: "Test different dashboard emphasis between release tracking and inbound activity.",
    variants: ["control", "ops-first"],
  },
]

export function assignExperimentVariant(experimentId: string, subjectId: string) {
  const experiment = experimentCatalog.find((item) => item.id === experimentId)

  if (!experiment) {
    return null
  }

  const seed = `${experimentId}:${subjectId}`
  const digest = createHash("sha256").update(seed).digest("hex")
  const bucket = Number.parseInt(digest.slice(0, 8), 16)
  const index = bucket % experiment.variants.length

  return experiment.variants[index]
}

export function getExperimentAssignments(subjectId: string) {
  return experimentCatalog.map((experiment) => ({
    id: experiment.id,
    variant: assignExperimentVariant(experiment.id, subjectId),
    description: experiment.description,
  }))
}
