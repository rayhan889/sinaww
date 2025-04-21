import Topbar from '@/components/topbar'
import Sidebar from '@/components/sidebar'

export default function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Topbar />
      <Sidebar />

      <section className='container mx-auto flex h-screen max-w-6xl items-center justify-center overflow-y-auto'>
        {children}
      </section>
    </>
  )
}
