'use server'

import { prisma } from '@/prisma/prisma'
import { auth } from '@clerk/nextjs/server'

export async function getUserCredits() {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { credits: true },
    })

    return { success: true, credits: user?.credits ?? 0 }
  } catch (error) {
    console.error('Error fetching user credits:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch credits',
    }
  }
}

export async function purchaseCredits(amount: number) {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    // In a real implementation, this would be handled by Stripe
    // For now, we'll just update the credits directly
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: { credits: true },
    })

    return { success: true, credits: updatedUser.credits }
  } catch (error) {
    console.error('Error purchasing credits:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to purchase credits',
    }
  }
}
