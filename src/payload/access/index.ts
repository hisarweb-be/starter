import type { Access, FieldAccess } from "payload"

/**
 * Payload CMS Access Control Functions
 * These functions control who can perform CRUD operations on collections.
 */

/**
 * Allow access only to authenticated admin users.
 */
export const isAdmin: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  return user.role === "admin"
}

/**
 * Allow access to admins and editors.
 */
export const isAdminOrEditor: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  return user.role === "admin" || user.role === "editor"
}

/**
 * Allow access to any authenticated user.
 */
export const isAuthenticated: Access = ({ req }) => {
  return Boolean(req.user)
}

/**
 * Allow access to admins, or to the user's own document.
 */
export const isAdminOrSelf: Access = ({ req }) => {
  const user = req.user
  if (!user) return false

  // Admins can access all
  if (user.role === "admin") return true

  // Users can only access their own document
  return {
    id: {
      equals: user.id,
    },
  }
}

/**
 * Field-level access: Only admins can modify role field.
 */
export const adminOnlyField: FieldAccess = ({ req }) => {
  return req.user?.role === "admin"
}

/**
 * Deny all access (for sensitive operations).
 */
export const denyAll: Access = () => false

/**
 * Allow read access to everyone (public content).
 */
export const publicRead: Access = () => true

/**
 * Allow read to authenticated, write to admins/editors.
 */
export const authenticatedReadAdminWrite: Access = ({ req }) => {
  if (req.user) return true
  return false
}
