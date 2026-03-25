import type { CollectionConfig } from "payload"

const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "summary", type: "textarea" },
    { name: "featured", type: "checkbox", defaultValue: false },
  ],
}

export default Services
