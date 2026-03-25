import type { GlobalConfig } from "payload"

const SiteConfig: GlobalConfig = {
  slug: "site-config",
  fields: [
    { name: "siteName", type: "text", required: true },
    { name: "tagline", type: "text" },
    {
      name: "defaultLocale",
      type: "select",
      defaultValue: "nl",
      options: [
        { label: "Dutch", value: "nl" },
        { label: "English", value: "en" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Turkish", value: "tr" },
      ],
    },
    { name: "allowRegistration", type: "checkbox", defaultValue: false },
    {
      name: "theme",
      type: "group",
      fields: [
        {
          name: "borderRadius",
          type: "select",
          defaultValue: "rounded",
          options: [
            { label: "Square", value: "none" },
            { label: "Soft", value: "rounded" },
            { label: "Round", value: "full" },
          ],
        },
        {
          name: "shadows",
          type: "select",
          defaultValue: "sm",
          options: [
            { label: "None", value: "none" },
            { label: "Soft", value: "sm" },
            { label: "Strong", value: "lg" },
          ],
        },
        {
          name: "primaryColor",
          type: "text",
          defaultValue: "#3b82f6",
        },
      ],
    },
  ],
}

export default SiteConfig
