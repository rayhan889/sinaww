'use client'

import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { type DocumentSchema } from '@/zod-schemas/document'
import { LoaderCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { readableDate } from '@/lib/helper/readableDate'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

const DocumentList = () => {
  const { data: documents, isPending: isLoadingDocuments } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents')
      const data = await response.json()
      return data as DocumentSchema[]
    }
  })

  return (
    <>
      {isLoadingDocuments || !documents ? (
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex w-fit items-center gap-2 text-zinc-500'>
            <LoaderCircle className='animate-spin' size={20} />
            <span>Loading documents...</span>
          </div>
        </div>
      ) : (
        <>
          {documents.length > 0 ? (
            <div className='grid h-full w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
              {documents?.slice(0, 6).map(document => {
                const slug = document.title.toLowerCase().replace(/\s+/g, '_')
                const description =
                  document.description.length > 300
                    ? document.description.slice(0, 300) + '...'
                    : document.description
                return (
                  <Link
                    href={`/dashboard/documents/${slug}`}
                    key={`document-${document.id}`}
                    className='col-span-1 flex h-[30vh] w-full flex-col items-start justify-start space-y-2 rounded-sm border border-zinc-200 p-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100'
                  >
                    <div className='mb-3 flex items-center gap-1 text-zinc-500'>
                      <Calendar size={14} />
                      <h5 className='text-sm'>
                        {readableDate(new Date(document.createdAt))}
                      </h5>
                    </div>
                    <div className='flex w-full flex-col gap-2'>
                      <h3 className='text-lg font-medium'>{document.title}</h3>
                      <p className='w-full text-sm leading-relaxed text-zinc-500 md:text-base'>
                        {description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center gap-12'>
              <Image
                src='/document_empty.svg'
                width={100}
                height={100}
                alt='empty state image'
              />
              <div className='flex flex-col items-center'>
                <h2 className='text-lg'>No Documents Yet</h2>
                <p className='text-sm text-muted-foreground'>
                  <Link href='/dashboard/create-document' className='underline'>
                    Create your first document
                  </Link>{' '}
                  to get started!
                </p>
              </div>
            </div>
          )}
          <>
            {documents.length > 0 && (
              <div className='flex w-full flex-col items-center gap-4 md:flex-row md:justify-between'>
                <span className='w-fit text-sm text-muted-foreground'>
                  Showing 1 to 6 of {documents.length} results
                </span>
                <div className='flex w-fit items-center justify-center gap-4 py-3 md:justify-end'>
                  <Button variant='outline' size='icon'>
                    <ChevronLeft size={20} />
                  </Button>
                  <div className='flex items-center gap-2'>
                    {[1, 2, 3].map((item, index) => (
                      <Button key={index} size='icon' variant='ghost'>
                        {item}
                      </Button>
                    ))}
                  </div>
                  <Button variant='outline' size='icon'>
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            )}
          </>
        </>
      )}
    </>
  )
}

export default DocumentList
