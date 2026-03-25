import type { CollectionConfig } from "payload"

const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "excerpt", type: "textarea" },
    { name: "content", type: "textarea" },
    { name: "publishedAt", type: "date" },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
    },
  ],
}

export default Posts
