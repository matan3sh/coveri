import { WritingStyle } from '@prisma/client'

export type CoverLetter = {
  id: string
  date: Date
  clerkUserId: string
  jobTitle: string
  companyWebsite: string
  jobDescription: string
  workHistory: string
  coverLetter: string
  writingStyle: WritingStyle
  createdAt: Date
  updatedAt: Date
}
