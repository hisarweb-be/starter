import type { CollectionConfig } from "payload"

import { isAdminOrEditor, publicRead } from "@/payload/access"

const Media: CollectionConfig = {
  slug: "media",
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    // Security: Limit file size to 5MB via imageSizes
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
    ],
  },
  admin: {
    useAsTitle: "alt",
    group: "Content",
  },
  access: {
    // Anyone can read/view media (public assets)
    read: publicRead,
    // Only admins and editors can upload
    create: isAdminOrEditor,
    // Only admins and editors can update
    update: isAdminOrEditor,
    // Only admins and editors can delete
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description: "Alternative text for accessibility",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Optional caption for the media",
      },
    },
  ],
}

export default Media
