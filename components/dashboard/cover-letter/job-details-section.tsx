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
import { cn } from '@/lib/utils'
import { CharacterCount } from './character-count'
import { type FormSectionProps } from './cover-letter.types'

export function JobDetailsSection({ control }: FormSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Senior Software Engineer"
                {...field}
                className={cn(
                  field.value?.length > 80 && 'border-yellow-500',
                  field.value?.length > 95 && 'border-red-500'
                )}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>The position you&apos;re applying for</span>
              <CharacterCount current={field.value?.length || 0} max={100} />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyWebsite"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Website</FormLabel>
            <FormControl>
              <Input
                placeholder="https://company.com"
                {...field}
                className={cn(
                  field.value?.length > 80 && 'border-yellow-500',
                  field.value?.length > 95 && 'border-red-500'
                )}
              />
            </FormControl>
            <FormDescription className="flex justify-between">
              <span>The company&apos;s website URL</span>
              <CharacterCount current={field.value?.length || 0} max={100} />
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
