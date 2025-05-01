import { withAuth } from '@/lib/api-handler'
import { type FormDocumentSchema } from '@/zod-schemas/document'
import { QUERIES, MUTATIONS } from '@/server/queries/document'

export const GET = withAuth(async (req, userId) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const result = await QUERIES.getDocumentsByUserId(userId!, page)

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

export const POST = withAuth(async (req, userId) => {
  const body = await req.json()

  const data: FormDocumentSchema = body

  const documentId = await MUTATIONS.createDocument({
    data,
    userId
  })

  return new Response(JSON.stringify(documentId), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})
