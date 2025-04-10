'use server'

import { createLogger } from '@/lib/logger'
import { CoverLettersResponse } from '@/lib/schemas'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Create a logger specific to this module
const logger = createLogger('get-cover-letters')

export async function getCoverLetters(): Promise<CoverLettersResponse> {
  try {
    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to getCoverLetters')
      return { success: false, error: 'Unauthorized' }
    }

    const coverLetters = await prisma.coverLetter.findMany({
      where: {
        clerkUserId: user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    logger.debug(
      `Retrieved ${coverLetters.length} cover letters for user ${user.id}`
    )
    return { success: true, data: coverLetters }
  } catch (error) {
    logger.error('Error fetching cover letters', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch cover letters',
    }
  }
}
