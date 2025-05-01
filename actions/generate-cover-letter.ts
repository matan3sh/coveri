'use server'

import { createLogger } from '@/lib/logger'
import { CoverLetterFormValues, CoverLetterResponse } from '@/lib/schemas'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { OpenAI } from 'openai'

// Create a logger specific to this module
const logger = createLogger('generate-cover-letter')

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCoverLetter(
  data: CoverLetterFormValues
): Promise<CoverLetterResponse> {
  try {
    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to generateCoverLetter')
      return {
        success: false,
        error: 'Unauthorized',
      }
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

    if (!dbUser) {
      logger.error(`User ${user.id} not found in database`)
      return {
        success: false,
        error: 'User account not found',
      }
    }

    if (dbUser.credits < 1) {
      logger.warn(
        `User ${user.id} attempted to generate a cover letter with insufficient credits (${dbUser.credits} credits)`
      )
      return {
        success: false,
        error:
          'Insufficient credits. Please purchase credits to generate a cover letter.',
      }
    }

    logger.info(`Generating cover letter for user ${user.id}`, {
      jobTitle: data.jobTitle,
      writingStyle: data.writingStyle,
      remainingCredits: dbUser.credits,
    })

    // Convert writingStyle enum to a more descriptive value for the AI
    const styleDescription =
      data.writingStyle === 'FORMAL'
        ? 'professional and formal'
        : 'conversational and friendly'

    // Generate the cover letter using AI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional cover letter writer. Create a ${styleDescription} cover letter for the job title "${data.jobTitle}" based on the provided work history. Make it personalized and unique.`,
        },
        {
          role: 'user',
          content: `Write a cover letter for a ${data.jobTitle} position. Here's the job description: ${data.jobDescription}. Here's my work history: ${data.workHistory}`,
        },
      ],
      temperature: 0.7,
    })

    const coverLetterContent =
      completion.choices[0]?.message?.content?.trim() || ''

    // Deduct one credit from the user
    const updatedUser = await prisma.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
      select: {
        credits: true,
      },
    })

    // Store the cover letter in the database
    const coverLetter = await prisma.coverLetter.create({
      data: {
        clerkUserId: user.id,
        coverLetter: coverLetterContent,
        date: new Date(),
        jobTitle: data.jobTitle,
        companyWebsite: data.companyWebsite || '',
        jobDescription: data.jobDescription,
        workHistory: data.workHistory,
        writingStyle: data.writingStyle,
      },
    })

    logger.success(`Cover letter generated successfully for user ${user.id}`, {
      coverId: coverLetter.id,
      remainingCredits: updatedUser.credits,
    })

    return {
      success: true,
      data: coverLetter,
    }
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
