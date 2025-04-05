'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../ui/button'
import { CharacterCount } from './character-count'
import { type WorkHistorySectionProps } from './types'

export function WorkHistorySection({
  control,
  setValue,
}: WorkHistorySectionProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from file')
      }

      const truncatedText = data.text.slice(0, 1000)
      setValue('workHistory', truncatedText)

      if (data.text.length > 1000) {
        toast.warning(
          'Your work history was truncated to fit the 1000 character limit'
        )
      } else {
        toast.success('Successfully extracted work history from resume')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to process file'
      setUploadError(message)
      toast.error(message)
      console.error('Error processing file:', error)
    }
  }

  return (
    <FormField
      control={control}
      name="workHistory"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Work History</FormLabel>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  ref={field.ref}
                  name={field.name}
                />
              </FormControl>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
              {field.value && (
                <CharacterCount current={field.value.length} max={1000} />
              )}
            </div>
            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
            <FormControl>
              <Textarea
                placeholder="Your work history will appear here after uploading your resume. You can also type or edit it directly."
                className={cn(
                  'min-h-[200px] resize-none',
                  field.value?.length > 800 && 'border-yellow-500',
                  field.value?.length > 950 && 'border-red-500'
                )}
                value={field.value}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    field.onChange(e)
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Upload your resume (supports .doc, .docx, .pdf) - we&apos;ll
              extract your work experience, or type it directly. Limited to 1000
              characters.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
