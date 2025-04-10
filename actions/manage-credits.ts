'use server'

import { createLogger } from '@/lib/logger'
import { prisma } from '@/prisma/prisma'
import { currentUser } from '@clerk/nextjs/server'

// Create a logger specific to this module
const logger = createLogger('manage-credits')

interface GetUserCreditsResponse {
  success: boolean
  credits?: number
  error?: string
}

/**
 * Get the current user's credits
 * @returns The user's current credit balance
 */
export async function getUserCredits(): Promise<GetUserCreditsResponse> {
  try {
    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to getUserCredits')
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      select: {
        credits: true,
      },
    })

    logger.debug(
      `Retrieved credits for user ${user.id}: ${dbUser?.credits ?? 0}`
    )
    return {
      success: true,
      credits: dbUser?.credits ?? 0,
    }
  } catch (error) {
    logger.error('Error getting user credits', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get user credits',
    }
  }
}

/**
 * Add credits to the current user's account
 * @param amount The amount of credits to add
 */
export async function purchaseCredits(amount: number) {
  try {
    const user = await currentUser()
    if (!user) {
      logger.warn('Unauthorized access attempt to purchaseCredits')
      return null
    }

    logger.info(`Adding ${amount} credits to user ${user.id}`)

    const updatedUser = await prisma.user.update({
      where: {
        clerkUserId: user.id,
      },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: {
        credits: true,
      },
    })

    logger.success(
      `Credits updated for user ${user.id}. New balance: ${updatedUser.credits}`
    )
    return updatedUser.credits
  } catch (error) {
    logger.error(`Error purchasing credits: ${amount}`, error)
    throw error
  }
}

/**
 * Update credits for a user by their Clerk ID - used by webhooks
 * @param clerkUserId The Clerk user ID
 * @param amount The amount of credits to add
 */
export async function updateCreditsForUser(
  clerkUserId: string,
  amount: number
) {
  try {
    if (!clerkUserId) {
      logger.error('No user ID provided to updateCreditsForUser')
      throw new Error('User ID is required')
    }

    logger.info(`Adding ${amount} credits to user ${clerkUserId} via webhook`)

    const updatedUser = await prisma.user.update({
      where: {
        clerkUserId,
      },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: {
        credits: true,
      },
    })

    logger.success(
      `Credits updated for user ${clerkUserId} via webhook. New balance: ${updatedUser.credits}`
    )
    return updatedUser.credits
  } catch (error) {
    logger.error(
      `Error updating credits for user ${clerkUserId}: ${amount}`,
      error
    )
    throw error
  }
}
