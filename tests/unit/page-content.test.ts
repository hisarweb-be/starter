import { describe, expect, it } from "vitest"

import {
  mergeMarketingPageContent,
  splitContentParagraphs,
} from "../../src/lib/page-content"

const fallback = {
  eyebrow: "Eyebrow",
  title: "Fallback title",
  description: "Fallback description",
  highlights: ["One", "Two", "Three"],
  ctaTitle: "CTA",
  ctaDescription: "CTA description",
  body: [],
}

describe("page content helpers", () => {
  it("splits content into paragraphs", () => {
    expect(splitContentParagraphs("Intro paragraph\n\nSecond paragraph\nline two")).toEqual([
      "Intro paragraph",
      "Second paragraph line two",
    ])
  })

  it("merges CMS page content over fallback content", () => {
    const result = mergeMarketingPageContent({
      fallback,
      source: {
        title: "CMS title",
        summary: "CMS description\nHighlight one\nHighlight two",
        content: "Body one\n\nBody two",
      },
    })

    expect(result.title).toBe("CMS title")
    expect(result.description).toBe("CMS description")
    expect(result.highlights).toEqual(["Highlight one", "Highlight two"])
    expect(result.body).toEqual(["Body one", "Body two"])
  })
})
