'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { CharacterCount } from './character-count'
import { type FormSectionProps } from './cover-letter.types'

export function JobDescriptionSection({ control }: FormSectionProps) {
  return (
    <FormField
      control={control}
      name="jobDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Job Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Paste the job description here..."
              className={cn(
                'min-h-[200px] resize-none',
                field.value?.length > 800 && 'border-yellow-500',
                field.value?.length > 950 && 'border-red-500'
              )}
              {...field}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  field.onChange(e)
                }
              }}
            />
          </FormControl>
          <FormDescription className="flex justify-between">
            <span>Copy and paste the job description from the job posting</span>
            <CharacterCount current={field.value?.length || 0} max={1000} />
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
