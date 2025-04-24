import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'

const rubik = Rubik({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Sinaww',
  description: 'Your AI-Powered assistant to support your learning journey'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${rubik.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
