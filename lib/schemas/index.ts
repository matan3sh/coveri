import { WritingStyle } from '@prisma/client'
import { z } from 'zod'

// User Schema
export const userSchema = z.object({
  id: z.string().cuid(),
  clerkUserId: z.string(),
  email: z.string().email(),
  credits: z.number().int().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

// Cover Letter Schema
export const coverLetterSchema = z.object({
  id: z.string().cuid(),
  date: z.date(),
  clerkUserId: z.string(),
  jobTitle: z.string().min(1).max(100),
  companyWebsite: z.string().url().min(1).max(100),
  jobDescription: z.string().min(1).max(1000),
  workHistory: z.string().min(1).max(1000),
  coverLetter: z.string().min(1),
  writingStyle: z.nativeEnum(WritingStyle),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CoverLetter = z.infer<typeof coverLetterSchema>

// Form Schemas
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
  writingStyle: z.nativeEnum(WritingStyle, {
    required_error: 'Please select a writing style',
  }),
})

export type CoverLetterFormValues = z.infer<typeof coverLetterFormSchema>

// Update Cover Letter Schema
export const updateCoverLetterSchema = z.object({
  id: z.string().cuid(),
  content: z
    .string()
    .min(1, 'Cover letter content is required')
    .max(1000, 'Cover letter must be less than 1000 characters'),
})

export type UpdateCoverLetterValues = z.infer<typeof updateCoverLetterSchema>

// Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type UserResponse = ApiResponse<User>
export type CoverLetterResponse = ApiResponse<CoverLetter>
export type CoverLettersResponse = ApiResponse<CoverLetter[]>
