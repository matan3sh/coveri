'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import {
  coverLetterFormSchema,
  type CoverLetterFormValues,
} from '@/lib/schemas/cover-letter'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { JobDescriptionSection } from './job-description-section'
import { JobDetailsSection } from './job-details-section'
import { WorkHistorySection } from './work-history-section'
import { WritingStyleSection } from './writing-style-section'

export function CoverLetterForm() {
  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterFormSchema),
    defaultValues: {
      jobTitle: '',
      companyWebsite: '',
      jobDescription: '',
      workHistory: '',
      writingStyle: undefined,
    },
    mode: 'onTouched', // Only validate after field is touched
  })

  const isSubmitting = form.formState.isSubmitting
  const isDirty = form.formState.isDirty

  // Watch all form fields for character counting
  const formValues = form.watch()

  // Calculate form completion percentage
  const totalFields = 5
  const completedFields = Object.entries(formValues).filter(([key, value]) => {
    if (key === 'writingStyle') return !!value // Just check if it exists
    return value && value.toString().trim().length > 0
  }).length
  const completionPercentage = (completedFields / totalFields) * 100

  const onSubmit = async (data: CoverLetterFormValues) => {
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

        <JobDetailsSection control={form.control} />

        <div className="grid grid-cols-1 gap-6">
          <JobDescriptionSection control={form.control} />
          <WorkHistorySection control={form.control} setValue={form.setValue} />
          <WritingStyleSection control={form.control} />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isDirty || !formValues.writingStyle}
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
