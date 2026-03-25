import type { GlobalConfig } from "payload"

const Navigation: GlobalConfig = {
  slug: "navigation",
  fields: [
    {
      name: "items",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
  ],
}

export default Navigation
