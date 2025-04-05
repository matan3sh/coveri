import * as z from 'zod'

export const coverLetterFormSchema = z.object({
  jobTitle: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Job title must be less than 100 characters'),
  companyWebsite: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Company website is required')
    .max(100, 'Company website must be less than 100 characters'),
  jobDescription: z
    .string()
    .min(1, 'Job description is required')
    .max(1000, 'Job description must be less than 1000 characters'),
  workHistory: z
    .string()
    .min(1, 'Work history is required')
    .max(1000, 'Work history must be less than 1000 characters'),
  writingStyle: z.enum(['FORMAL', 'INFORMAL'], {
    required_error: 'Please select a writing style',
  }),
})

export type CoverLetterFormValues = z.infer<typeof coverLetterFormSchema>
