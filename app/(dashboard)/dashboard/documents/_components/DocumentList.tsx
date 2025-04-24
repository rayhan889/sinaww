'use client'

import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { type DocumentSchema } from '@/zod-schemas/document'
import { LoaderCircle } from 'lucide-react'
import { readableDate } from '@/lib/helper/readableDate'

const DocumentList = () => {
  const { data: documents, isPending: isLoadingDocuments } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents')
      const data = await response.json()
      return data as DocumentSchema[]
    }
  })

  console.log(documents)

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
        <div className='grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
          {documents?.map((document, index) => {
            const slug = document.title.toLowerCase().replace(/\s+/g, '_')
            const isLastDocument = index === documents.length - 1
            const description =
              document.description.length > 300
                ? document.description.slice(0, 300) + '...'
                : document.description
            return (
              <Link
                href={`/dashboard/documents/${slug}`}
                key={`document-${document.id}`}
                className={`${isLastDocument ? 'md:col-span-3' : 'col-span-1'} flex h-[34vh] w-full flex-col items-start justify-start space-y-2 rounded-sm border border-zinc-200 p-3 transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-100`}
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
      )}
    </>
  )
}

export default DocumentList
