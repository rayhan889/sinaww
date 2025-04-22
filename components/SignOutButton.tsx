'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const SignOutButton = ({ className }: { className?: string }) => {
  return (
    <Button
      className={`w-full ${className}`}
      style={{ justifyContent: 'start' }}
      onClick={() => signOut({ callbackUrl: '/' })}
      variant='ghost'
    >
      Sign Out
    </Button>
  )
}

export default SignOutButton
