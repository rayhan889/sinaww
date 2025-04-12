'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Signin() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loginWithGoogle = async () => {
    setIsLoading(true)

    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.log('Sign in error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='mx-auto w-full lg:max-w-lg'>
      <div className='flex flex-col space-y-4 p-2'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl'>Sign In</h1>
          <span className='text-zinc-400'>
            Welcome back to Sinaww! Please sign in to your account.
          </span>
        </div>
        <hr className='w-full border-zinc-200' />
        <div className='flex w-full flex-col items-center gap-4'>
          <Button
            isLoading={isLoading}
            variant='outline'
            className='w-full'
            onClick={loginWithGoogle}
            disabled={isLoading}
          >
            {isLoading ? null : <FcGoogle className='mr-1 h-4 w-4' />}
            Google
          </Button>
          <p className='text-sm text-zinc-400'>
            Didn&apos;t have an account?{' '}
            <Link href='/signup' className='font-medium text-zinc-950'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
