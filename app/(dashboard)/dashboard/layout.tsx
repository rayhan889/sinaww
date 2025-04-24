export default function DashboardLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <div className='w-full'>{children}</div>
      {modal}
    </>
  )
}
