'use server'

import { createLogger } from '@/lib/logger'
import { CoverLetterResponse, UpdateCoverLetterValues } from '@/lib/schemas'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Create a logger specific to this module
const logger = createLogger('update-cover-letter')

export async function updateCoverLetter(
  data: UpdateCoverLetterValues
): Promise<CoverLetterResponse> {
  try {
    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to updateCoverLetter')
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const coverLetter = await prisma.coverLetter.findUnique({
      where: {
        id: data.id,
      },
      select: {
        clerkUserId: true,
      },
    })

    if (!coverLetter) {
      logger.warn(`Cover letter not found: ${data.id}`)
      return {
        success: false,
        error: 'Cover letter not found',
      }
    }

    if (coverLetter.clerkUserId !== user.id) {
      logger.warn(
        `User ${user.id} attempted to update a cover letter that doesn't belong to them: ${data.id}`
      )
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const updatedCoverLetter = await prisma.coverLetter.update({
      where: {
        id: data.id,
      },
      data: {
        coverLetter: data.content,
        updatedAt: new Date(),
      },
    })

    logger.success(`Cover letter updated: ${data.id}`)
    return {
      success: true,
      data: updatedCoverLetter,
    }
  } catch (error) {
    logger.error('Error updating cover letter', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update cover letter',
    }
  }
}
