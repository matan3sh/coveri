'use server'

import { createLogger } from '@/lib/logger'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { OpenAI } from 'openai'
import { z } from 'zod'

// Create a logger specific to this module
const logger = createLogger('generate-cover-letter')

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema for validating generate cover letter data
const generateCoverLetterSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  companyWebsite: z.string().optional(),
  jobDescription: z.string().min(1, 'Job description is required'),
  workHistory: z.string().min(1, 'Work history is required'),
  writingStyle: z.enum(['FORMAL', 'INFORMAL']).default('FORMAL'),
})

export async function generateCoverLetter(
  data: z.infer<typeof generateCoverLetterSchema>
) {
  try {
    // Validate input data
    const validatedData = generateCoverLetterSchema.parse(data)

    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to generateCoverLetter')
      throw new Error('Unauthorized')
    }

    // Check if the user has enough credits
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      select: {
        credits: true,
      },
    })

    if (!dbUser || dbUser.credits < 1) {
      logger.warn(
        `User ${user.id} attempted to generate a cover letter with insufficient credits`
      )
      throw new Error('Not enough credits')
    }

    logger.info(`Generating cover letter for user ${user.id}`, {
      jobTitle: validatedData.jobTitle,
      writingStyle: validatedData.writingStyle,
    })

    // Convert writingStyle enum to a more descriptive value for the AI
    const styleDescription =
      validatedData.writingStyle === 'FORMAL'
        ? 'professional and formal'
        : 'conversational and friendly'

    // Generate the cover letter using AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional cover letter writer. Create a ${styleDescription} cover letter for the job title "${validatedData.jobTitle}" based on the provided work history. Make it personalized and unique.`,
        },
        {
          role: 'user',
          content: `Write a cover letter for a ${validatedData.jobTitle} position. Here's the job description: ${validatedData.jobDescription}. Here's my work history: ${validatedData.workHistory}`,
        },
      ],
      temperature: 0.7,
    })

    const coverLetterContent =
      completion.choices[0]?.message?.content?.trim() || ''

    // Deduct one credit from the user
    await prisma.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    })

    // Store the cover letter in the database
    const coverLetter = await prisma.coverLetter.create({
      data: {
        clerkUserId: user.id,
        coverLetter: coverLetterContent,
        date: new Date(),
        jobTitle: validatedData.jobTitle,
        companyWebsite: validatedData.companyWebsite || '',
        jobDescription: validatedData.jobDescription,
        workHistory: validatedData.workHistory,
        writingStyle: validatedData.writingStyle,
      },
    })

    logger.success(`Cover letter generated successfully for user ${user.id}`, {
      coverId: coverLetter.id,
    })
    return { success: true, coverLetter }
  } catch (error) {
    logger.error('Error generating cover letter', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate cover letter',
    }
  }
}
