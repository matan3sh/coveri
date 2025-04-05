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
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

export function CoverLetterForm() {
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
  const workHistory = form.watch('workHistory')

  const isSubmitting = form.formState.isSubmitting
  const isValid = form.formState.isValid

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
                      'min-h-[100px] resize-none',
                      jobDescription.length > 200 && 'border-yellow-500',
                      jobDescription.length > 245 && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>
                    Copy and paste the job description from the job posting
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      jobDescription.length > 200 && 'text-yellow-500',
                      jobDescription.length > 245 && 'text-red-500'
                    )}
                  >
                    {jobDescription.length}/255
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work History</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Copy and paste the Experience section from your CV here..."
                    className={cn(
                      'min-h-[100px] resize-none',
                      workHistory.length > 200 && 'border-yellow-500',
                      workHistory.length > 245 && 'border-red-500'
                    )}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>
                    Copy and paste the Experience section from your CV
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      workHistory.length > 200 && 'text-yellow-500',
                      workHistory.length > 245 && 'text-red-500'
                    )}
                  >
                    {workHistory.length}/255
                  </span>
                </FormDescription>
                <FormMessage />
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
