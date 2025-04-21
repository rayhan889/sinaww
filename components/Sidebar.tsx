import { Search, NotebookText, File } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

const Sidebar = () => {
  const navLinks = [
    {
      name: 'Search',
      href: '/dashboard/search',
      icon: <Search />
    },
    {
      name: 'Notes',
      href: '/dashboard/notes',
      icon: <NotebookText />
    },
    {
      name: 'Documents',
      href: '/dashboard/documents',
      icon: <File />
    }
  ]
  return (
    <aside className='left-0 top-0 hidden h-screen w-60 border-r border-zinc-200 md:fixed md:block'>
      <div className='mt-0 flex h-full flex-col p-5 md:mt-16'>
        <ul className='w-full space-y-3'>
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                style={{
                  justifyContent: 'start'
                }}
                className={`${buttonVariants({ variant: 'ghost', className: 'flex w-full' })}`}
              >
                {link.icon}
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
