'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

const Topbar = () => {
  const { data: session } = useSession()

  return (
    <nav className='fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white'>
      <div className='container mx-auto flex w-full max-w-7xl items-center justify-between'>
        <Link href='/' className={`${buttonVariants({ variant: 'link' })}`}>
          <h1>Sinaww</h1>
        </Link>

        {!session?.user && (
          <Link
            href='/signin'
            className={`${buttonVariants({ variant: 'ghost' })}`}
          >
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Topbar
