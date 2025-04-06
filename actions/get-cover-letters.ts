'use server'

import { prisma } from '@/prisma/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getCoverLetters() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const coverLetters = await prisma.coverLetter.findMany({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, coverLetters }
  } catch (error) {
    console.error('Error fetching cover letters:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch cover letters',
    }
  }
}
