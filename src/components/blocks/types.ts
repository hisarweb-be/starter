export type FeatureItem = {
  title: string
  description?: string | null
  icon?: string | null
}

export type TestimonialItem = {
  quote: string
  author: string
  role?: string | null
  avatar?: unknown
}

export type PricingFeatureItem = {
  feature?: string | null
}

export type PricingPlan = {
  name: string
  price: string
  features?: PricingFeatureItem[] | null
  buttonText?: string | null
  buttonLink?: string | null
}

export type RelationshipItem = string | number | { id?: string | number; title?: string | null }

export type HeroBlockData = {
  blockType: "hero"
  title: string
  subtitle?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  backgroundImage?: unknown
}

export type FeaturesBlockData = {
  blockType: "features"
  title?: string | null
  features?: FeatureItem[] | null
}

export type TestimonialsBlockData = {
  blockType: "testimonials"
  title?: string | null
  testimonials?: TestimonialItem[] | null
}

export type CtaBlockData = {
  blockType: "cta"
  title: string
  description?: string | null
  buttonText: string
  buttonLink: string
}

export type ServicesBlockData = {
  blockType: "services-block"
  title?: string | null
  services?: RelationshipItem[] | null
}

export type PortfolioGridBlockData = {
  blockType: "portfolio-grid"
  title?: string | null
  items?: RelationshipItem[] | null
}

export type PricingBlockData = {
  blockType: "pricing"
  title?: string | null
  plans?: PricingPlan[] | null
}

export type FaqBlockData = {
  blockType: "faq-block"
  title?: string | null
  items?: RelationshipItem[] | null
}

export type RichTextBlockData = {
  blockType: "rich-text"
  content: unknown
}

export type ContactFormBlockData = {
  blockType: "contact-form"
  title?: string | null
  subtitle?: string | null
  namePlaceholder?: string | null
  emailPlaceholder?: string | null
  messagePlaceholder?: string | null
  buttonText?: string | null
  successMessage?: string | null
  organizationId?: string | null
}

export type GalleryImage = {
  url: string
  alt?: string | null
  caption?: string | null
}

export type GalleryBlockData = {
  blockType: "gallery"
  title?: string | null
  columns?: number | null
  images?: GalleryImage[] | null
}

export type VideoEmbedBlockData = {
  blockType: "video-embed"
  title?: string | null
  url: string
  caption?: string | null
  autoplay?: boolean | null
}

export type AccordionItem = {
  title: string
  content: string
}

export type AccordionBlockData = {
  blockType: "accordion"
  title?: string | null
  items?: AccordionItem[] | null
}

export type TabItem = {
  label: string
  content: string
}

export type TabsBlockData = {
  blockType: "tabs"
  title?: string | null
  tabs?: TabItem[] | null
}

export type CodeBlockData = {
  blockType: "code"
  title?: string | null
  code: string
  language?: string | null
}

export type TimelineEvent = {
  date: string
  title: string
  description?: string | null
}

export type TimelineBlockData = {
  blockType: "timeline"
  title?: string | null
  events?: TimelineEvent[] | null
}

export type MapBlockData = {
  blockType: "map"
  title?: string | null
  latitude: number
  longitude: number
  zoom?: number | null
  caption?: string | null
}

export type RenderablePageBlock =
  | HeroBlockData
  | FeaturesBlockData
  | TestimonialsBlockData
  | CtaBlockData
  | ServicesBlockData
  | PortfolioGridBlockData
  | PricingBlockData
  | FaqBlockData
  | RichTextBlockData
  | ContactFormBlockData
  | GalleryBlockData
  | VideoEmbedBlockData
  | AccordionBlockData
  | TabsBlockData
  | CodeBlockData
  | TimelineBlockData
  | MapBlockData

export type UnknownPageBlock = {
  blockType?: string | null
} & Record<string, unknown>

export type PageBlockLike = RenderablePageBlock | UnknownPageBlock
