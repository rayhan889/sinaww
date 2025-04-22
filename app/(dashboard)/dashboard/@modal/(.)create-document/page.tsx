import { getAuthSession } from '@/lib/auth'

import DialogPortal from '@/components/dialog-portal'
import CreateDocForm from '@/components/create-doc-form'

export default async function CreateDocumentModal() {
  const session = await getAuthSession()

  if (!session?.user) return null

  return (
    <DialogPortal title='Create Document'>
      <CreateDocForm user={session?.user} />
    </DialogPortal>
  )
}
