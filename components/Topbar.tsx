'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import getInitials from '@/helper/getInitials'
import Image from 'next/image'

import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import SignOutButton from '@/components/SignOutButton'

const Topbar = () => {
  const { data: session } = useSession()

  return (
    <nav className='fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white'>
      <div className='mx-5 flex w-full items-center justify-between'>
        <Link href='/' className={`${buttonVariants({ variant: 'link' })}`}>
          <Image src='/logo.png' alt='Logo' width={24} height={24} />
          <h1>Sinaww.</h1>
        </Link>

        {!session?.user ? (
          <Link
            href='/signin'
            className={`${buttonVariants({ variant: 'ghost' })}`}
          >
            <span>Sign In</span>
          </Link>
        ) : (
          <div className='flex items-center gap-3'>
            <Link
              href='/dashboard'
              className={`${buttonVariants({ variant: 'ghost' })}`}
            >
              <span>Dashboard</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={session?.user?.image as string}
                    alt={session?.user?.name as string}
                  />
                  <AvatarFallback>
                    <h4 className='text-sm'>
                      {getInitials(session?.user?.name as string)}
                    </h4>
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <SignOutButton className='px-2 py-1.5 font-normal' />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Topbar
