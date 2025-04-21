import { Plus, Calendar, Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Documents() {
  const documents = [
    {
      title: 'My Document',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      date_added: '2023-10-01'
    },
    {
      title: 'My Document Nigga',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      date_added: '2023-10-01'
    }
  ]

  return (
    <section className='flex h-full w-full flex-col items-start justify-start space-y-16 pt-24'>
      <div className='flex w-full items-center justify-between'>
        <h2 className='text-2xl font-semibold'>📚 My Documents</h2>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline'>
            <Filter size={20} />
            Sort Document
          </Button>
          <Button size='sm'>
            <Plus size={20} />
            Add New Document
          </Button>
        </div>
      </div>
      <div className='grid w-full grid-cols-3 gap-3'>
        {[...documents, ...documents, ...documents].map((document, index) => {
          const slug = document.title.toLowerCase().replace(/\s+/g, '_')
          return (
            <Link
              href={`/dashboard/documents/${slug}`}
              key={`document-${index}`}
              className='col-span-1 flex h-[34vh] w-full flex-col items-start justify-start space-y-2 rounded-sm border border-zinc-200 p-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100'
            >
              <div className='mb-3 flex items-center gap-1 text-zinc-500'>
                <Calendar size={14} />
                <h5 className='text-sm'>{document.date_added}</h5>
              </div>
              <div className='flex w-full flex-col gap-2'>
                <h3 className='text-lg font-medium'>{document.title}</h3>
                <p className='leading-relaxed text-zinc-500'>
                  {document.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
