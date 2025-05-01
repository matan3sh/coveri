'use client'

import { generateCoverLetter } from '@/actions/generate-cover-letter'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'
import { useCredits } from '@/hooks/use-credits'
import { useToast } from '@/hooks/use-toast'
import {
  coverLetterFormSchema,
  type CoverLetterFormValues,
} from '@/lib/schemas/cover-letter'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { JobDescriptionSection } from './job-description-section'
import { JobDetailsSection } from './job-details-section'
import { WorkHistorySection } from './work-history-section'
import { WritingStyleSection } from './writing-style-section'

export function CoverLetterForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { loadCredits } = useCredits()

  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterFormSchema),
    defaultValues: {
      jobTitle: '',
      companyWebsite: '',
      jobDescription: '',
      workHistory: '',
      writingStyle: undefined,
    },
    mode: 'onTouched',
  })

  const isDirty = form.formState.isDirty
  const formValues = form.watch()

  const totalFields = 5
  const completedFields = Object.entries(formValues).filter(([key, value]) => {
    if (key === 'writingStyle') return !!value
    return value && value.toString().trim().length > 0
  }).length
  const completionPercentage = (completedFields / totalFields) * 100

  const onSubmit = async (data: CoverLetterFormValues) => {
    startTransition(async () => {
      try {
        const result = await generateCoverLetter(data)

        if (!result?.success) {
          throw new Error(result?.error || 'Failed to generate cover letter')
        }

        // Refresh credits before navigation
        await loadCredits()

        router.push('/dashboard')
        router.refresh()
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to generate cover letter',
          variant: 'destructive',
        })
      }
    })
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
          disabled={isPending || !isDirty || !formValues.writingStyle}
        >
          {isPending ? (
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
