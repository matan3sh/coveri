import { createLogger } from '@/lib/logger'
import { prisma } from '@/prisma/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Create a logger specific to this module
const logger = createLogger('users-api')

/**
 * GET handler - Fetch user data from database
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      logger.warn('Unauthorized access attempt to GET /api/users')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      logger.warn(`User not found: ${userId}`)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    logger.info(`User data retrieved: ${userId}`)
    return NextResponse.json(user)
  } catch (error) {
    logger.error('Error fetching user', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

/**
 * POST handler - Create user in database
 */
export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      logger.warn('Unauthorized access attempt to POST /api/users')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details from Clerk
    const user = await currentUser()
    if (!user || !user.emailAddresses[0]?.emailAddress) {
      logger.error('User email not found')
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    const email = user.emailAddresses[0].emailAddress

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (existingUser) {
      logger.info(`User already exists: ${userId}`)
      return NextResponse.json(existingUser)
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email,
        credits: 3, // Give 3 free credits to new users
      },
    })

    logger.success(`User created: ${userId}`, {
      email,
      initialCredits: 3,
    })
    return NextResponse.json(newUser)
  } catch (error) {
    logger.error('Error creating user', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
