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

export const QUERIES = {
  getDocumentsByUserId: async (userId: string): Promise<DocumentSchema[]> => {
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

    const result = documents.map(document => ({
      ...document,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString()
    }))

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
