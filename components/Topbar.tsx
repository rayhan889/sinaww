import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

const Topbar = () => {
  return (
    <nav className='fixed left-0 right-0 top-0 z-50 hidden h-20 items-center justify-between border-b border-zinc-200 bg-white md:flex'>
      <div className='container mx-auto flex w-full max-w-7xl items-center justify-between'>
        <Link
          href='/'
          className={`${buttonVariants({ variant: 'link', className: 'hidden md:block' })}`}
        >
          <h1>Sinaww</h1>
        </Link>
      </div>
    </nav>
  )
}

export default Topbar
