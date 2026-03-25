import { describe, expect, it } from "vitest"

import { assignExperimentVariant, experimentCatalog, getExperimentAssignments } from "../../src/lib/experiments"

describe("experiments", () => {
  it("assigns deterministic variants for the same subject", () => {
    const first = assignExperimentVariant("homepage-hero-copy", "admin@hisarweb.be")
    const second = assignExperimentVariant("homepage-hero-copy", "admin@hisarweb.be")

    expect(first).toBe(second)
  })

  it("returns assignments for the whole catalog", () => {
    const assignments = getExperimentAssignments("owner@hisarweb.be")

    expect(assignments).toHaveLength(experimentCatalog.length)
    expect(assignments[0]?.variant).toBeTruthy()
  })
})
