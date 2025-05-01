'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const DISPLAYED_PAGINATION = 5

export const Pagination = ({
  totalPages,
  totalData,
  currentPage
}: {
  totalPages: number
  totalData: number
  currentPage: number
}) => {
  const router = useRouter()

  const handleChangePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    router.push(`?page=${page}`)
  }

  const getPaginationRange = () => {
    const pages = []

    let start = Math.max(1, currentPage - Math.floor(DISPLAYED_PAGINATION / 2))
    let end = start + DISPLAYED_PAGINATION - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - DISPLAYED_PAGINATION + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className='flex w-full flex-col items-center gap-4 md:flex-row md:justify-between'>
      <span className='w-fit text-sm text-muted-foreground'>
        Showing {(currentPage - 1) * 6 + 1} to{' '}
        {Math.min(currentPage * 6, totalData)} of {totalData} results
      </span>
      <div className='flex w-fit items-center justify-center gap-4 py-3 md:justify-end'>
        <Button
          onClick={() => handleChangePage(currentPage - 1)}
          variant='ghost'
          size='icon'
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
        </Button>
        <div className='flex items-center gap-2'>
          {getPaginationRange()
            .slice(0, DISPLAYED_PAGINATION)
            .map(page => (
              <Button
                key={`page-${page}`}
                size='icon'
                onClick={() => handleChangePage(page)}
                variant={currentPage === page ? 'outline' : 'ghost'}
                className='font-normal'
              >
                {page}
              </Button>
            ))}
          {totalPages > DISPLAYED_PAGINATION &&
            getPaginationRange().slice(-1)[0] < totalPages && (
              <Button disabled size='icon' variant='ghost'>
                ...
              </Button>
            )}
        </div>
        <Button
          onClick={() => handleChangePage(currentPage + 1)}
          variant='ghost'
          size='icon'
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  )
}
