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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  coverLetterFormSchema,
  type CoverLetterFormValues,
} from '@/lib/schemas/cover-letter'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldValues } from 'react-hook-form'

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

  function onSubmit(data: CoverLetterFormValues) {
    // This will be implemented in the future
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Software Engineer" {...field} />
              </FormControl>
              <FormDescription>
                The position you&apos;re applying for (max 100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyWebsite"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input placeholder="https://company.com" {...field} />
              </FormControl>
              <FormDescription>
                The company&apos;s website URL (max 100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Copy and paste the job description from the job posting (max 255
                characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workHistory"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Work History</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Copy and paste the Experience section from your CV here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Copy and paste the Experience section from your CV (max 255
                characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="writingStyle"
          render={({ field }: { field: FieldValues }) => (
            <FormItem>
              <FormLabel>Writing Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a writing style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the tone for your cover letter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Generate Cover Letter
        </Button>
      </form>
    </Form>
  )
}
