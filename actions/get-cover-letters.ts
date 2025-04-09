'use server'

import { createLogger } from '@/lib/logger'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Create a logger specific to this module
const logger = createLogger('get-cover-letters')

export async function getCoverLetters() {
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
    return { success: true, coverLetters }
  } catch (error) {
    logger.error('Error fetching cover letters', error)
    return { success: false, error: 'Failed to fetch cover letters' }
  }
}
