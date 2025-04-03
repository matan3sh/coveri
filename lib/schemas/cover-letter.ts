import * as z from 'zod'

export const coverLetterFormSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  companyWebsite: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Company website is required'),
  workHistory: z
    .string()
    .min(1, 'Work history is required')
    .max(255, 'Work history must be less than 255 characters'),
  writingStyle: z.enum(['formal', 'informal'], {
    required_error: 'Please select a writing style',
  }),
})

export type CoverLetterFormValues = z.infer<typeof coverLetterFormSchema>
