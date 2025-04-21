'use client'

import * as Dialog from '@radix-ui/react-dialog'

type DialogPortalProps = {
  children: React.ReactNode
  title: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogPortal = ({
  children,
  title,
  open,
  onOpenChange
}: DialogPortalProps) => {
  return (
    <Dialog.Root open={true} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/30' />
        <Dialog.Content className='fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded bg-white p-4 shadow-md'>
          <Dialog.Title className='text-lg font-medium'>{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogPortal
