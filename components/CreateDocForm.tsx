'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  formDocumentSchema,
  type FormDocumentSchema
} from '@/zod-schemas/document'
import { useDropzone } from 'react-dropzone'
import { useCallback, useEffect, useState, useRef } from 'react'
import { uploadFiles } from '@/lib/uploadthing'
import { LoaderCircle, FileUp, FileText, Trash2, X } from 'lucide-react'
import { truncateFileName } from '@/lib/helper/truncateText'
import Link from 'next/link'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import pdfToText from 'react-pdftotext'
import type { DescriptionResponsePayload } from '@/app/api/generate_desc/route'
import { createId } from '@paralleldrive/cuid2'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 4 * 1024 * 1024

const CreateDocForm = () => {
  const searchParams = useSearchParams()

  const currentPage: number = Number(searchParams.get('page')) || 1

  const [fileUploading, setFileUploading] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [pdfText, setPdfText] = useState<string | null>(null)
  const [generatingDesc, setGeneratingDesc] = useState(false)
  const [pdfUploadId, setPdfUploadId] = useState<string | null>(null)

  const router = useRouter()
  const queryClient = useQueryClient()

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const defaultValues: FormDocumentSchema = {
    description: '',
    title: '',
    file: {
      fileName: '',
      fileType: '',
      path: ''
    }
  }

  const form = useForm<FormDocumentSchema>({
    resolver: zodResolver(formDocumentSchema),
    defaultValues
  })

  const { mutate: createDocument, isPending: isCreatingDocument } = useMutation(
    {
      mutationFn: async () => {
        const payload: FormDocumentSchema = {
          title: form.getValues('title'),
          description: form.getValues('description'),
          file: form.getValues('file')
        }

        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        return data as string
      },
      onError: (error: Error) => {
        onClearForm()
        router.back()

        toast.error(`Error creating document: ${error.message}`)
      },
      onSuccess: () => {
        onClearForm()
        router.back()

        queryClient.invalidateQueries({ queryKey: ['documents', currentPage] })

        toast.success('Document successfully created!')
      }
    }
  )

  const onUploadFile = useCallback(
    async (file: File): Promise<string> => {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size is too large')
        form.setError('file', {
          message: `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB`
        })
        return ''
      }

      setFileUploading(true)

      try {
        const result = await uploadFiles('pdfUploader', {
          files: [file]
        })
        setFileUploading(false)
        return result.map(file => file.ufsUrl)[0]
      } catch (error) {
        console.log('file upload error:', error)
        setFileUploading(false)
        setFileError('File upload failed. Please try again.')
        form.setError('file', {
          message: 'File upload failed. Please try again.'
        })
        return ''
      }
    },
    [form, setFileError, setFileUploading]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFileError(null)
        form.clearErrors('file')

        const singleFile = acceptedFiles[0]
        const uploadededFileUrl = await onUploadFile(singleFile)

        if (uploadededFileUrl) {
          const fileWithUfsUrl = {
            fileName: singleFile.name,
            fileType: singleFile.type,
            path: uploadededFileUrl
          }

          form.setValue('file', fileWithUfsUrl, {
            shouldValidate: true,
            shouldDirty: true
          })

          pdfToText(singleFile)
            .then(text => {
              setPdfText(text)
              setPdfUploadId(createId())
            })
            .catch((error: Error) => {
              console.error(error.message)
              toast.error(`Error converting pdf to text: ${error.message}`)
            })
        }
      }
    },
    [form, onUploadFile]
  )

  const { data: summaryDescription, error: errorSummaryDescription } = useQuery(
    {
      queryKey: ['generate_desc', pdfUploadId],
      queryFn: async () => {
        if (!pdfText) return null

        setGeneratingDesc(true)

        try {
          const response = await fetch('/api/generate_desc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: pdfText })
          })

          const data = await response.json()

          return data as DescriptionResponsePayload
        } finally {
          setGeneratingDesc(false)
        }
      },
      enabled: !!pdfText && !!pdfUploadId
    }
  )

  useEffect(() => {
    if (errorSummaryDescription) {
      console.error(
        'Error generating summary description:',
        errorSummaryDescription.message
      )
      toast.error(
        `Error generating summary description: ${errorSummaryDescription.message}`
      )
    }
    if (summaryDescription) {
      form.setValue('description', summaryDescription.summary_text, {
        shouldValidate: true
      })
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 25}px`
      }
    }
    if (form.getValues('file.path') === '') {
      form.setValue('description', defaultValues.description, {
        shouldValidate: true
      })
    }
  }, [
    summaryDescription,
    form,
    errorSummaryDescription,
    defaultValues.description
  ])

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf']
      },
      maxFiles: 1,
      maxSize: MAX_FILE_SIZE,
      onDropRejected(fileRejections) {
        setFileUploading(false)

        const sizeError = fileRejections.find(rejection =>
          rejection.errors.some(error => error.code === 'file-too-large')
        )

        if (sizeError) {
          const errorMessage = `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB`
          setFileError(errorMessage)
          form.setError('file', {
            message: errorMessage
          })
        } else {
          const errorMessage = 'File upload failed. Please try again.'
          setFileError(errorMessage)
          form.setError('file', {
            message: errorMessage
          })
        }
      }
    })

  const onRemoveFile = () => {
    setFileError(null)
    form.setValue('file', defaultValues.file, { shouldValidate: true })
    form.setValue('description', defaultValues.description, {
      shouldValidate: true
    })
    setPdfText(null)
    setPdfUploadId(null)
    form.clearErrors('file')
  }

  const onClearForm = () => {
    setFileError(null)
    form.reset(defaultValues)
    form.clearErrors()
    setPdfText(null)
    setPdfUploadId(null)
  }

  const onSubmit = () => {
    createDocument()
  }

  const getFileErrorMessage = (): string | null | undefined => {
    if (fileError) return fileError
    if (form.formState.errors.file) {
      if (typeof form.formState.errors.file.message === 'string') {
        return form.formState.errors.file.message
      }
      if (form.formState.errors.file.fileName) {
        return form.formState.errors.file.fileName.message
      }
      if (form.formState.errors.file.path) {
        return form.formState.errors.file.path.message
      }
      if (form.formState.errors.file.fileType) {
        return form.formState.errors.file.fileType.message
      }
    }
    if (fileRejections.length > 0) {
      return fileRejections[0].errors[0].message || 'Invalid file!'
    }
    return null
  }

  const currentFileError = getFileErrorMessage()

  return (
    <div className='mt-5'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-3'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Assholery' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='file'
            render={() => (
              <FormItem>
                <FormLabel
                  className={`${currentFileError ? 'text-destructive' : ''}`}
                >
                  Document
                  <span
                    className={
                      currentFileError
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }
                  ></span>
                </FormLabel>
                {form.getValues('file.fileName') ? (
                  <div className='flex h-fit w-full items-center rounded-md border border-input bg-transparent p-2 text-sm shadow-sm'>
                    <div className='flex w-full items-center justify-between rounded-md bg-zinc-100 p-2'>
                      <Link
                        href={form.getValues('file.path')}
                        rel='noopener noreferrer'
                        target='_blank'
                        className='flex items-center gap-2 text-sm hover:underline'
                      >
                        <FileText size={16} />
                        {truncateFileName(form.getValues('file.fileName'), 40)}
                      </Link>
                      <X
                        size={16}
                        onClick={onRemoveFile}
                        className='cursor-pointer'
                      />
                    </div>
                  </div>
                ) : (
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors ${isDragActive ? 'bg-accent' : 'bg-muted text-muted-foreground'}`}
                    >
                      {fileUploading ? (
                        <>
                          <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />
                          <p>Uploading...</p>
                        </>
                      ) : (
                        <>
                          <FileUp className='h-5 w-5' />
                          {isDragActive ? (
                            <p>Drop the file here!</p>
                          ) : (
                            <p>Click here or drag the file to upload it!</p>
                          )}
                        </>
                      )}
                      <Input type='file' {...getInputProps()} />
                    </div>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => {
              /* eslint-disable @typescript-eslint/no-unused-vars */
              const { ref, ...restField } = field
              return (
                <FormItem>
                  <FormLabel className='text-zinc-950'>Description</FormLabel>
                  <FormControl>
                    {generatingDesc ? (
                      <div className='disabled flex min-h-24 w-full flex-col items-center justify-center gap-3 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-sm'>
                        <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />
                        <p>Generating description...</p>
                      </div>
                    ) : (
                      <textarea
                        disabled
                        ref={el => {
                          field.ref(el)
                          textareaRef.current = el
                        }}
                        className='min-h-24 w-full resize-none overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm'
                        placeholder='Description is auto generated from the document'
                        {...restField}
                      />
                    )}
                  </FormControl>
                </FormItem>
              )
            }}
          />
          <div className='mt-4 flex w-full items-center justify-end gap-2'>
            <Button
              type='submit'
              size='sm'
              variant='outline'
              disabled={
                !form.getValues('file') ||
                !form.getValues('title') ||
                !form.getValues('description') ||
                fileUploading ||
                isCreatingDocument
              }
              onClick={onClearForm}
            >
              <Trash2 size={20} />
              Clear
            </Button>
            <Button
              type='submit'
              size='sm'
              disabled={
                !form.getValues('file') ||
                !form.getValues('title') ||
                !form.getValues('description') ||
                fileUploading ||
                isCreatingDocument
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateDocForm
