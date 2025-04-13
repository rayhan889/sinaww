'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { Github } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Signin() {
  const [email, setEmail] = useState<string>('')
  const [isAuthGoogleLoading, setIsAuthGoogleLoading] = useState<boolean>(false)
  const [isAuthGithubLoading, setIsAuthGithubLoading] = useState<boolean>(false)

  const loginWithGoogle = async () => {
    setIsAuthGoogleLoading(true)

    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      console.log('Sign in error', error)
    } finally {
      setIsAuthGoogleLoading(false)
    }
  }

  const loginWithGithub = async () => {
    setIsAuthGithubLoading(true)

    try {
      await signIn('github', { callbackUrl: '/' })
    } catch (error) {
      console.log('Sign in error', error)
    } finally {
      setIsAuthGithubLoading(false)
    }
  }

  const loginWithEmail = async () => {
    const signinResult = await signIn('email', {
      email,
      callbackUrl: '/',
      redirect: false
    })

    if (signinResult?.error) {
      console.log('Error signing in with email', signinResult.error)
    } else {
      console.log('Email sent successfully')
    }

    setEmail('')
  }

  return (
    <section className='mx-auto w-full lg:max-w-md'>
      <div className='flex flex-col space-y-4 p-2'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-medium'>Sinaww</h1>
          <span className='text-sm text-zinc-400'>
            Easier way to manage your documents and notes.
          </span>
        </div>

        <div className='flex w-full flex-col items-center gap-4'>
          <Button
            isLoading={isAuthGoogleLoading}
            variant='outline'
            className='w-full'
            onClick={loginWithGoogle}
            disabled={isAuthGoogleLoading}
          >
            {isAuthGoogleLoading ? null : <FcGoogle className='mr-1 h-4 w-4' />}
            Continue with Google
          </Button>
          <Button
            isLoading={isAuthGithubLoading}
            variant='outline'
            className='w-full'
            onClick={loginWithGithub}
            disabled={isAuthGithubLoading}
          >
            {isAuthGithubLoading ? null : <Github className='mr-1 h-4 w-4' />}
            Continue with Github
          </Button>
          <hr className='w-full border-zinc-200' />
          <form action={loginWithEmail} className='flex w-full flex-col gap-6'>
            <div className='grid items-center gap-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                type='email'
                id='email'
                placeholder='Email'
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <Button type='submit'>Continue</Button>
          </form>
          <p className='mt-4 max-w-sm text-center text-xs text-zinc-400'>
            By continuing, you acknowledge that you understand and agree to the{' '}
            <u>Terms & Conditions</u> and <u>Privacy Policy</u>
          </p>
        </div>
      </div>
    </section>
  )
}
