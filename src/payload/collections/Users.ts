import type { CollectionConfig } from "payload"

import { adminOnlyField, isAdmin, isAdminOrSelf } from "@/payload/access"

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 86400, // 24 hours
    maxLoginAttempts: 5,
    lockTime: 30 * 60 * 1000, // 30 minutes
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "Admin",
  },
  access: {
    // Only admins can create new users
    create: isAdmin,
    // Users can read their own data, admins can read all
    read: isAdminOrSelf,
    // Users can update their own data, admins can update all
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
    // Only admins can unlock locked accounts
    unlock: isAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      defaultValue: "user",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "User", value: "user" },
      ],
      // Only admins can change roles
      access: {
        create: adminOnlyField,
        update: adminOnlyField,
      },
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
  ],
}

export default Users
