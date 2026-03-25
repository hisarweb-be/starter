import type { CollectionConfig } from "payload"

const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "textarea" },
    {
      name: "coverImage",
      type: "relationship",
      relationTo: "media",
    },
  ],
}

export default Portfolio
