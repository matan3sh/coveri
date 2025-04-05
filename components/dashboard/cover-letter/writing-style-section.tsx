'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type FormSectionProps } from './cover-letter.types'

export function WritingStyleSection({ control }: FormSectionProps) {
  return (
    <FormField
      control={control}
      name="writingStyle"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Writing Style</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a writing style" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="FORMAL">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Formal</TooltipTrigger>
                    <TooltipContent>
                      <p>Professional and traditional tone</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SelectItem>
              <SelectItem value="INFORMAL">
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
  )
}
