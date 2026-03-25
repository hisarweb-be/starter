import type { CollectionConfig } from "payload"

import { isAdmin, isAuthenticated } from "@/payload/access"

const Settings: CollectionConfig = {
  slug: "settings",
  admin: {
    useAsTitle: "key",
    group: "Admin",
    defaultColumns: ["key", "group", "updatedAt"],
  },
  access: {
    // Only admins can create settings
    create: isAdmin,
    // Authenticated users can read settings
    read: isAuthenticated,
    // Only admins can update settings
    update: isAdmin,
    // Only admins can delete settings
    delete: isAdmin,
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Unique identifier for this setting",
      },
    },
    {
      name: "value",
      type: "textarea",
      admin: {
        description: "Setting value (can be JSON for complex values)",
      },
    },
    {
      name: "group",
      type: "select",
      options: [
        { label: "General", value: "general" },
        { label: "Branding", value: "branding" },
        { label: "Content", value: "content" },
        { label: "Integration", value: "integration" },
        { label: "Security", value: "security" },
      ],
      defaultValue: "general",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "description",
      type: "text",
      admin: {
        description: "Optional description of what this setting controls",
      },
    },
  ],
}

export default Settings
