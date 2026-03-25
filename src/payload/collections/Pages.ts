import type { CollectionConfig } from "payload"

import { isAdminOrEditor, publicRead } from "@/payload/access"
import {
  HeroBlock,
  FeaturesBlock,
  TestimonialsBlock,
  CtaBlock,
  ServicesBlock,
  PortfolioGridBlock,
  PricingBlock,
  FaqBlock,
  RichTextBlock,
} from "../blocks"

const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "slug", "locale", "updatedAt"],
  },
  access: {
    // Anyone can read published pages
    read: publicRead,
    // Only admins and editors can create pages
    create: isAdminOrEditor,
    // Only admins and editors can update pages
    update: isAdminOrEditor,
    // Only admins and editors can delete pages
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL-friendly identifier (e.g., 'about-us')",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "locale",
      type: "select",
      defaultValue: "nl",
      options: [
        { label: "Dutch", value: "nl" },
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Turkish", value: "tr" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "meta",
      type: "group",
      fields: [
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "SEO meta description (max 160 characters)",
          },
        },
        {
          name: "keywords",
          type: "text",
          admin: {
            description: "Comma-separated keywords for SEO",
          },
        },
      ],
    },
    {
      name: "blocks",
      type: "blocks",
      blocks: [
        HeroBlock,
        FeaturesBlock,
        TestimonialsBlock,
        CtaBlock,
        ServicesBlock,
        PortfolioGridBlock,
        PricingBlock,
        FaqBlock,
        RichTextBlock,
      ],
    },
  ],
}

export default Pages
