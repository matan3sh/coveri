'use server'

import { createLogger } from '@/lib/logger'
import { CoverLetterFormValues, CoverLetterResponse } from '@/lib/schemas'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
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
          content: `You are a professional cover letter writer. Create a ${styleDescription} cover letter for the job title "${data.jobTitle}" based on the provided work history. Make it personalized and unique.

IMPORTANT INSTRUCTIONS:
1. Generate ONLY the cover letter content itself
2. DO NOT include:
   - Header with contact information
   - Recipient's address
   - Date
   - Any placeholder text like [Your Name] or [Company Name]
   - Any formatting instructions
   - Bullet points or lists
   - Work history in bullet point format
   - Any section headers or labels
3. Start directly with "Dear [Hiring Manager]" or similar greeting
4. End with a professional closing like "Sincerely" or "Best regards"
5. Write in a flowing paragraph style, not in bullet points or lists
6. Do not repeat or list out the work history - incorporate it naturally into the narrative

The output should be a clean, flowing cover letter text that can be directly used.`,
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

    // Use a transaction to ensure both credit deduction and cover letter creation happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // First, deduct one credit from the user
      const updatedUser = await tx.user.update({
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

      // Then, create the cover letter
      const coverLetter = await tx.coverLetter.create({
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

      return { updatedUser, coverLetter }
    })

    logger.success(`Cover letter generated successfully for user ${user.id}`, {
      coverId: result.coverLetter.id,
      remainingCredits: result.updatedUser.credits,
    })

    // Revalidate both root and dashboard layouts to update the credits indicator
    revalidatePath('/', 'layout')
    revalidatePath('/dashboard', 'layout')

    return {
      success: true,
      data: result.coverLetter,
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
