import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Topbar />
      <Sidebar />

      <section className='container mx-auto flex h-screen w-full max-w-6xl items-center justify-center overflow-y-auto'>
        {children}
      </section>
    </>
  )
}
