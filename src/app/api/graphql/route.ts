import { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } from "@payloadcms/next/routes"

import configPromise from "@/payload/payload.config"

// Only enable GraphQL Playground in development
export const GET = process.env.NODE_ENV === "production"
  ? () => new Response("Not Found", { status: 404 })
  : GRAPHQL_PLAYGROUND_GET(configPromise)

export const POST = GRAPHQL_POST(configPromise)
