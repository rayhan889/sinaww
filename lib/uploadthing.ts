import { generateReactHelpers } from '@uploadthing/react'

import type { SingleMainFileRouter } from '@/app/api/uploadthing/core'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<SingleMainFileRouter>()
