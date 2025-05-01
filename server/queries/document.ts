import 'server-only'

import { db } from '@/server/db'
import {
  documents as documentsTable,
  files as filesTable
} from '@/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import {
  type DocumentSchema,
  type FormDocumentSchema
} from '@/zod-schemas/document'

export type DocumentQuery = {
  data: DocumentSchema[]
  meta: { limit: number; page: number; total: number }
}

export const QUERIES = {
  getDocumentsByUserId: async (
    userId: string,
    page: number
  ): Promise<DocumentQuery> => {
    const LIMIT = 6
    const offset = (page - 1) * LIMIT

    const documents = await db
      .select({
        id: documentsTable.id,
        title: documentsTable.title,
        description: documentsTable.description,
        userId: documentsTable.userId,
        file: {
          fileName: filesTable.fileName,
          fileType: filesTable.fileType,
          path: filesTable.path
        },
        createdAt: documentsTable.createdAt,
        updatedAt: documentsTable.updatedAt
      })
      .from(documentsTable)
      .where(eq(documentsTable.userId, userId))
      .innerJoin(filesTable, eq(documentsTable.id, filesTable.documentId))
      .orderBy(desc(documentsTable.createdAt))
      .limit(LIMIT)
      .offset(offset)

    const documentsLength = (
      await db
        .select()
        .from(documentsTable)
        .where(eq(documentsTable.userId, userId))
    ).length

    const data = documents.map(document => ({
      ...document,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString()
    }))

    const meta = {
      limit: LIMIT,
      page,
      total: documentsLength
    }

    const result = {
      data,
      meta
    }

    return result
  }
}

export const MUTATIONS = {
  createDocument: async ({
    data,
    userId
  }: {
    data: FormDocumentSchema
    userId: string
  }): Promise<string> => {
    const { description, file, title } = data
    const document = await db
      .insert(documentsTable)
      .values({
        title,
        description,
        userId
      })
      .returning({ id: documentsTable.id })

    const documentId = document[0]!.id

    await db.insert(filesTable).values({
      documentId,
      fileName: file.fileName,
      fileType: file.fileType,
      path: file.path
    })

    return documentId
  }
}
