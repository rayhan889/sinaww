export default function DashboardLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      <div className='h-full w-full'>{children}</div>
      {modal}
    </>
  )
}
