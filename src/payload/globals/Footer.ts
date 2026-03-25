import type { GlobalConfig } from "payload"

const Footer: GlobalConfig = {
  slug: "footer",
  fields: [
    { name: "headline", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "links",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
}

export default Footer
