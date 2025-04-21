'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

import DialogPortal from '@/components/dialog-portal'
import { Button } from '@/components/ui/button'
import CreateDocForm from '@/components/create-doc-form'

export default function CreateDocumentModal() {
  const router = useRouter()

  return (
    <DialogPortal
      title='Create Document'
      onOpenChange={open => {
        if (!open) router.back()
      }}
    >
      <Button
        onClick={() => router.back}
        variant='ghost'
        size='icon'
        className='absolute right-3 top-3'
      >
        <X />
      </Button>
      <CreateDocForm />
    </DialogPortal>
  )
}
