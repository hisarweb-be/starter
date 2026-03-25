import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes"

import configPromise from "@/payload/payload.config"

const optionsHandler = REST_OPTIONS(configPromise)
const getHandler = REST_GET(configPromise)
const postHandler = REST_POST(configPromise)
const deleteHandler = REST_DELETE(configPromise)
const patchHandler = REST_PATCH(configPromise)
const putHandler = REST_PUT(configPromise)

function mapParams(params: Promise<{ payload: string[] }>) {
  return params.then(({ payload }) => ({ slug: payload }))
}

export async function OPTIONS(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return optionsHandler(request, { params: mapParams(args.params) })
}

export async function GET(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return getHandler(request, { params: mapParams(args.params) })
}

export async function POST(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return postHandler(request, { params: mapParams(args.params) })
}

export async function DELETE(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return deleteHandler(request, { params: mapParams(args.params) })
}

export async function PATCH(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return patchHandler(request, { params: mapParams(args.params) })
}

export async function PUT(
  request: Request,
  args: { params: Promise<{ payload: string[] }> }
) {
  return putHandler(request, { params: mapParams(args.params) })
}
