import { getAuthSession } from '@/lib/auth'

import DialogPortal from '@/components/DialogPortal'
import CreateDocForm from '@/components/CreateDocForm'

export default async function CreateDocumentModal() {
  const session = await getAuthSession()

  if (!session?.user) return null

  return (
    <DialogPortal title='Create Document'>
      <CreateDocForm user={session?.user} />
    </DialogPortal>
  )
}
