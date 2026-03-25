import type { CollectionConfig } from "payload"

const FAQ: CollectionConfig = {
  slug: "faq",
  admin: {
    useAsTitle: "question",
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    { name: "category", type: "text" },
  ],
}

export default FAQ
