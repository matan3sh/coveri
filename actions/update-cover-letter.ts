'use server'

import { createLogger } from '@/lib/logger'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

// Schema for validating update cover letter data
const updateCoverLetterSchema = z.object({
  id: z.string().min(1, 'Cover letter ID is required'),
  content: z
    .string()
    .min(1, 'Cover letter content is required')
    .max(1000, 'Cover letter must be less than 1000 characters'),
})

// Create a logger specific to this module
const logger = createLogger('update-cover-letter')

interface UpdateCoverLetterResponse {
  success: boolean
  error?: string
  data?: {
    id: string
    content: string
  }
}

export async function updateCoverLetter(
  data: z.infer<typeof updateCoverLetterSchema>
): Promise<UpdateCoverLetterResponse> {
  try {
    // Validate the input data
    const validatedData = updateCoverLetterSchema.parse(data)

    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to updateCoverLetter')
      throw new Error('Unauthorized')
    }

    const coverLetter = await prisma.coverLetter.findUnique({
      where: {
        id: validatedData.id,
      },
      select: {
        clerkUserId: true,
      },
    })

    if (!coverLetter) {
      logger.warn(`Cover letter not found: ${validatedData.id}`)
      throw new Error('Cover letter not found')
    }

    if (coverLetter.clerkUserId !== user.id) {
      logger.warn(
        `User ${user.id} attempted to update a cover letter that doesn't belong to them: ${validatedData.id}`
      )
      throw new Error('Unauthorized')
    }

    const updatedCoverLetter = await prisma.coverLetter.update({
      where: {
        id: validatedData.id,
      },
      data: {
        coverLetter: validatedData.content,
        updatedAt: new Date(),
      },
    })

    logger.success(`Cover letter updated: ${validatedData.id}`)
    return {
      success: true,
      data: {
        id: updatedCoverLetter.id,
        content: updatedCoverLetter.coverLetter,
      },
    }
  } catch (error) {
    logger.error('Error updating cover letter:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update cover letter',
    }
  }
}
