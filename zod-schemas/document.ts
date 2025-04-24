'use client'

import { z } from 'zod'

export const formDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(5000),
  file: z.object({
    fileName: z.string().min(1),
    fileType: z.string().min(1),
    path: z.string().url('Invalid file URL')
  })
})

export const documentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  file: z.object({
    fileName: z.string(),
    fileType: z.string(),
    path: z.string()
  }),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type DocumentSchema = z.infer<typeof documentSchema>
export type FormDocumentSchema = z.infer<typeof formDocumentSchema>
