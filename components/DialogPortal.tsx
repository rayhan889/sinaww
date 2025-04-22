'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type DialogPortalProps = {
  children: React.ReactNode
  title: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogPortal = ({ children, title }: DialogPortalProps) => {
  const router = useRouter()

  return (
    <Dialog.Root
      open={true}
      onOpenChange={open => {
        if (!open) router.back()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/30' />
        <Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-4 shadow-md md:max-w-2xl'>
          <Button
            onClick={() => router.back()}
            variant='ghost'
            size='icon'
            className='absolute right-3 top-3'
          >
            <X />
          </Button>
          <Dialog.Title className='text-lg font-medium'>{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogPortal
