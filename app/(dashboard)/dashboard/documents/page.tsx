import { Plus, Filter } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import DocumentList from './_components/DocumentList'

export default function Documents() {
  return (
    <section className='flex h-full w-full flex-col items-start justify-start space-y-14 pb-8 pt-24'>
      <div className='flex w-full flex-col items-start justify-between gap-5 md:flex-row md:items-center md:gap-0'>
        <h2 className='text-2xl font-semibold'>📚 My Documents</h2>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline'>
            <Filter size={20} />
            Sort Document
          </Button>
          <Link
            href='/dashboard/create-document'
            className={buttonVariants({ size: 'sm' })}
          >
            <Plus size={20} />
            Add New Document
          </Link>
        </div>
      </div>
      <DocumentList />
    </section>
  )
}
