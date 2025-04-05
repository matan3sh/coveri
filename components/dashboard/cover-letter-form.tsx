'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  coverLetterFormSchema,
  type CoverLetterFormValues,
} from '@/lib/schemas/cover-letter'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CoverLetterForm() {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterFormSchema),
    defaultValues: {
      jobTitle: '',
      companyWebsite: '',
      jobDescription: '',
      workHistory: '',
      writingStyle: 'formal',
    },
  })

  // Watch all fields to track character counts
  const jobTitle = form.watch('jobTitle')
  const companyWebsite = form.watch('companyWebsite')
  const jobDescription = form.watch('jobDescription')

  const isSubmitting = form.formState.isSubmitting
  const isValid = form.formState.isValid

  // Handle file upload and text extraction
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset any previous errors
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      // Log the raw response for debugging
      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError)
        throw new Error('Server returned an invalid response')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract text from file')
      }

      // Truncate text to 1000 characters if needed
      const truncatedText = data.text.slice(0, 1000)
      form.setValue('workHistory', truncatedText)

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

  // Calculate form completion percentage
  const totalFields = 5
  const completedFields = Object.values(form.getValues()).filter(
    (value) => value && value.toString().length > 0
  ).length
  const completionPercentage = (completedFields / totalFields) * 100

  function onSubmit(data: CoverLetterFormValues) {
    // This will be implemented in the future
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cover Letter Details</h3>
            <span className="text-sm text-muted-foreground">
              {completionPercentage.toFixed(0)}% complete
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Senior Software Engineer"
                    {...field}
                    className={cn(
                      jobTitle.length > 80 && 'border-yellow-500',
                      jobTitle.length > 95 && 'border-red-500'
                    )}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>The position you&apos;re applying for</span>
                  <span
                    className={cn(
                      'text-sm',
                      jobTitle.length > 80 && 'text-yellow-500',
                      jobTitle.length > 95 && 'text-red-500'
                    )}
                  >
                    {jobTitle.length}/100
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://company.com"
                    {...field}
                    className={cn(
                      companyWebsite.length > 80 && 'border-yellow-500',
                      companyWebsite.length > 95 && 'border-red-500'
                    )}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>The company&apos;s website URL</span>
                  <span
                    className={cn(
                      'text-sm',
                      companyWebsite.length > 80 && 'text-yellow-500',
                      companyWebsite.length > 95 && 'text-red-500'
                    )}
                  >
                    {companyWebsite.length}/100
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className={cn(
                      'min-h-[200px] resize-none',
                      jobDescription.length > 800 && 'border-yellow-500',
                      jobDescription.length > 950 && 'border-red-500'
                    )}
                    {...field}
                    onChange={(e) => {
                      // Prevent input if it would exceed the character limit
                      if (e.target.value.length <= 1000) {
                        field.onChange(e)
                      }
                    }}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>
                    Copy and paste the job description from the job posting
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      jobDescription.length > 800 && 'text-yellow-500',
                      jobDescription.length > 950 && 'text-red-500'
                    )}
                  >
                    {jobDescription.length}/1000
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workHistory"
            render={({ field: { value, ref, name, onChange } }) => (
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
                        ref={ref}
                        name={name}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById('file-upload')?.click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume
                    </Button>
                    {value && (
                      <span
                        className={cn(
                          'text-sm',
                          value.length > 800 && 'text-yellow-500',
                          value.length > 950 && 'text-red-500'
                        )}
                      >
                        {value.length}/1000 characters used
                      </span>
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
                        value?.length > 800 && 'border-yellow-500',
                        value?.length > 950 && 'border-red-500'
                      )}
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value
                        // Prevent input if it would exceed the character limit
                        if (newValue.length <= 1000) {
                          onChange(newValue)
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload your resume (supports .doc, .docx, .pdf) - we&apos;ll
                    extract your work experience, or type it directly. Limited
                    to 1000 characters.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="writingStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Writing Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a writing style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="formal">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>Formal</TooltipTrigger>
                          <TooltipContent>
                            <p>Professional and traditional tone</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectItem>
                    <SelectItem value="informal">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>Informal</TooltipTrigger>
                          <TooltipContent>
                            <p>More conversational and modern tone</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the tone for your cover letter
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Cover Letter'
          )}
        </Button>
      </form>
    </Form>
  )
}
