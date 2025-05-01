'use client'

import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { readableDate } from '@/lib/helper/readableDate'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { DocumentQuery } from '@/server/queries/document'
import { useSearchParams } from 'next/navigation'

import { Pagination } from '@/components/Pagination'

const DocumentList = () => {
  const searchParams = useSearchParams()

  const currentPage: number = Number(searchParams.get('page')) || 1

  const [totalPages, setTotalPages] = useState(1)
  const { data: documents, isPending: isLoadingDocuments } = useQuery({
    queryKey: ['documents', currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/documents?page=${currentPage}`)
      const data = await response.json()
      return data as DocumentQuery
    }
  })

  useEffect(() => {
    if (isLoadingDocuments || !documents) return
    setTotalPages(Math.ceil(documents.meta.total / 6))
  }, [documents, isLoadingDocuments])

  return (
    <>
      {isLoadingDocuments || !documents ? (
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex w-fit items-center gap-2 text-gray-600'>
            <LoaderCircle className='animate-spin' size={20} />
            <span>Loading documents...</span>
          </div>
        </div>
      ) : (
        <>
          {documents.data.length > 0 ? (
            <div className='flex h-full w-full flex-col justify-between space-y-8'>
              <div className='grid h-auto w-full grid-cols-1 grid-rows-6 gap-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3'>
                {documents.data?.map(document => {
                  const slug = document.title.toLowerCase().replace(/\s+/g, '_')
                  const description =
                    document.description.length > 300
                      ? document.description.slice(0, 300) + '...'
                      : document.description
                  return (
                    <Link
                      href={`/dashboard/documents/${slug}`}
                      key={`document-${document.id}`}
                      className='col-span-1 row-span-1 flex h-auto w-full flex-col items-start justify-start space-y-2 rounded-sm border border-gray-200 bg-white p-6 transition-all duration-200 ease-in-out hover:cursor-pointer hover:border-gray-300 hover:bg-gray-100'
                    >
                      <div className='mb-3 flex items-center gap-1 text-gray-600'>
                        <Calendar size={14} />
                        <h5 className='text-sm'>
                          {readableDate(new Date(document.createdAt))}
                        </h5>
                      </div>
                      <div className='flex w-full flex-col gap-2'>
                        <h3 className='text-lg font-medium'>
                          {document.title}
                        </h3>
                        <p className='w-full text-sm/3 leading-relaxed text-gray-600'>
                          {description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <div>
                {documents.meta.total > 0 && (
                  <Pagination
                    totalData={documents.meta.total}
                    totalPages={totalPages}
                    currentPage={currentPage}
                  />
                )}
              </div>
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
        </>
      )}
    </>
  )
}

export default DocumentList
