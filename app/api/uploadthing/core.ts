import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { getAuthSession } from '@/lib/auth'

const f = createUploadthing()

export const singleMainFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: '4MB',
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const session = await getAuthSession()
      const user = session?.user

      if (!user) throw new UploadThingError('Unauthorized')

      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Uploaded file', metadata, file)
    })
} satisfies FileRouter

export type SingleMainFileRouter = typeof singleMainFileRouter
