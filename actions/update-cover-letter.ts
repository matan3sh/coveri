'use server'

import { prisma } from '@/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'

const updateCoverLetterSchema = z.object({
  id: z.string().min(1, 'Cover letter ID is required'),
  content: z
    .string()
    .min(1, 'Cover letter content is required')
    .max(1000, 'Cover letter must be less than 1000 characters'),
})

export async function updateCoverLetter(
  data: z.infer<typeof updateCoverLetterSchema>
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    // Validate the input data
    const validatedData = updateCoverLetterSchema.parse(data)

    // Update the cover letter
    const updatedCoverLetter = await prisma.coverLetter.update({
      where: {
        id: validatedData.id,
        clerkUserId: userId, // Ensure the user owns the cover letter
      },
      data: {
        coverLetter: validatedData.content,
        updatedAt: new Date(),
      },
    })

    return { success: true, coverLetter: updatedCoverLetter }
  } catch (error) {
    console.error('Error updating cover letter:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update cover letter',
    }
  }
}
