import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Topbar />
      <Sidebar />

      <section className='container mx-auto flex h-screen max-w-6xl items-center justify-center'>
        {children}
      </section>
    </>
  )
}
