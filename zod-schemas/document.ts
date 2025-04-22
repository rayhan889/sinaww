'use client'

import { z } from 'zod'

export const formDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  userId: z.string(),
  file: z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    path: z.string().url('Invalid file URL')
  })
})

export type FormDocumentSchema = z.infer<typeof formDocumentSchema>
