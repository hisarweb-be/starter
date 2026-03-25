import {
  CtaBlockComponent,
} from "./blocks/CtaBlock"
import {
  FaqBlockComponent,
} from "./blocks/FaqBlock"
import {
  FeaturesBlockComponent,
} from "./blocks/FeaturesBlock"
import {
  HeroBlockComponent,
} from "./blocks/HeroBlock"
import {
  PortfolioGridBlockComponent,
} from "./blocks/PortfolioGridBlock"
import {
  PricingBlockComponent,
} from "./blocks/PricingBlock"
import {
  RichTextBlockComponent,
} from "./blocks/RichTextBlock"
import {
  ServicesBlockComponent,
} from "./blocks/ServicesBlock"
import {
  TestimonialsBlockComponent,
} from "./blocks/TestimonialsBlock"
import { ContactFormBlock } from "./blocks/ContactFormBlock"
import { GalleryBlockComponent } from "./blocks/GalleryBlock"
import { VideoEmbedBlockComponent } from "./blocks/VideoEmbedBlock"
import { AccordionBlockComponent } from "./blocks/AccordionBlock"
import { TabsBlockComponent } from "./blocks/TabsBlock"
import { CodeBlockComponent } from "./blocks/CodeBlock"
import { TimelineBlockComponent } from "./blocks/TimelineBlock"
import { MapBlockComponent } from "./blocks/MapBlock"
import type {
  AccordionBlockData,
  CodeBlockData,
  ContactFormBlockData,
  CtaBlockData,
  FaqBlockData,
  FeaturesBlockData,
  GalleryBlockData,
  HeroBlockData,
  MapBlockData,
  PageBlockLike,
  PortfolioGridBlockData,
  PricingBlockData,
  RichTextBlockData,
  ServicesBlockData,
  TabsBlockData,
  TestimonialsBlockData,
  TimelineBlockData,
  VideoEmbedBlockData,
} from "./blocks/types"

export function RenderBlocks({
  blocks,
  organizationId,
}: {
  blocks?: PageBlockLike[] | null
  organizationId?: string | null
}) {
  if (!blocks?.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType ?? "unknown"}-${index}`

        switch (block.blockType) {
          case "hero":
            return <HeroBlockComponent key={key} {...(block as HeroBlockData)} />
          case "features":
            return <FeaturesBlockComponent key={key} {...(block as FeaturesBlockData)} />
          case "testimonials":
            return <TestimonialsBlockComponent key={key} {...(block as TestimonialsBlockData)} />
          case "cta":
            return <CtaBlockComponent key={key} {...(block as CtaBlockData)} />
          case "services-block":
            return <ServicesBlockComponent key={key} {...(block as ServicesBlockData)} />
          case "portfolio-grid":
            return <PortfolioGridBlockComponent key={key} {...(block as PortfolioGridBlockData)} />
          case "pricing":
            return <PricingBlockComponent key={key} {...(block as PricingBlockData)} />
          case "faq-block":
            return <FaqBlockComponent key={key} {...(block as FaqBlockData)} />
          case "rich-text":
            return <RichTextBlockComponent key={key} {...(block as RichTextBlockData)} />
          case "contact-form":
            return (
              <ContactFormBlock
                key={key}
                {...(block as ContactFormBlockData)}
                organizationId={(block as ContactFormBlockData).organizationId ?? organizationId}
              />
            )
          case "gallery":
            return <GalleryBlockComponent key={key} {...(block as GalleryBlockData)} />
          case "video-embed":
            return <VideoEmbedBlockComponent key={key} {...(block as VideoEmbedBlockData)} />
          case "accordion":
            return <AccordionBlockComponent key={key} {...(block as AccordionBlockData)} />
          case "tabs":
            return <TabsBlockComponent key={key} {...(block as TabsBlockData)} />
          case "code":
            return <CodeBlockComponent key={key} {...(block as CodeBlockData)} />
          case "timeline":
            return <TimelineBlockComponent key={key} {...(block as TimelineBlockData)} />
          case "map":
            return <MapBlockComponent key={key} {...(block as MapBlockData)} />
          default:
            return (
              <div
                key={key}
                className="border-y border-dashed py-8 text-center text-muted-foreground"
              >
                Block type &quot;{block.blockType ?? "unknown"}&quot; not implemented
              </div>
            )
        }
      })}
    </>
  )
}
