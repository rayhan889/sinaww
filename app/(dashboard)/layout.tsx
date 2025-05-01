import { Suspense } from 'react'

import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense>
      <Topbar />
      <Sidebar />

      <section className='custom-scrollbar container mx-auto flex h-screen w-full max-w-6xl items-center justify-center overflow-y-auto'>
        {children}
      </section>
    </Suspense>
  )
}
