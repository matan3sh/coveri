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
    console.log('purchaseCredits - User ID:', userId)

    if (!userId) {
      throw new Error('Unauthorized')
    }

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { credits: true, clerkUserId: true },
    })
    console.log('purchaseCredits - Existing user:', existingUser)

    if (!existingUser) {
      throw new Error('User not found')
    }

    // Update credits
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: { credits: true },
    })
    console.log('purchaseCredits - Updated user:', updatedUser)

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
