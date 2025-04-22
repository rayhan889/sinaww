import { createRouteHandler } from 'uploadthing/next'

import { singleMainFileRouter } from './core'

export const { GET, POST } = createRouteHandler({
  router: singleMainFileRouter
})
