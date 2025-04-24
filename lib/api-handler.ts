import 'server-only'

import { getAuthSession } from '@/lib/auth'

type Handler = (req: Request, userId: string) => Promise<Response>

export const withAuth = (handler: Handler) => {
  return async (req: Request) => {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    return handler(req, session.user.id)
  }
}
