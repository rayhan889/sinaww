'use client'

import { SessionProvider } from 'next-auth/react'

export const Providers = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return <SessionProvider>{children}</SessionProvider>
}
