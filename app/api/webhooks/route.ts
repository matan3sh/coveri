import { createLogger } from '@/lib/logger'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Create a logger specific to this module
const logger = createLogger('stripe-webhook')

// Ensure this route is accessible
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // Get the signature and body
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    // Parse the request body for testing purposes
    let event: Stripe.Event

    // Check if we're in development mode and if the request has a special test header
    const isTestMode =
      process.env.NODE_ENV === 'development' &&
      req.headers.get('x-webhook-test') === 'true'

    if (isTestMode) {
      // For testing: Parse the body without verifying the signature
      logger.warn('TEST MODE: Bypassing signature verification')
      try {
        const parsedBody = JSON.parse(body)
        event = parsedBody as Stripe.Event
      } catch {
        // No need to use the error parameter if we're not using it
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        )
      }
    } else {
      // Production mode: Verify the signature
      if (!signature) {
        logger.warn('Missing Stripe signature in request')
        return NextResponse.json(
          {
            error: 'Missing stripe signature',
            hint: 'For testing, add the header "x-webhook-test: true" to bypass signature verification in development',
          },
          { status: 400 }
        )
      }

      // Construct and verify the event
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      logger.info(`Verified Stripe webhook event: ${event.type}`)
    }

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event)
    } else {
      logger.debug(`Ignoring unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Webhook error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    )
  }
}

/**
 * Handle the checkout.session.completed event
 */
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session
  logger.info(`Processing checkout session: ${session.id}`)

  // Extract the necessary data
  const amount = session.amount_total ? session.amount_total / 100 : 0
  const clerkUserId = session.metadata?.userId

  if (!clerkUserId) {
    logger.error('No user ID found in session metadata', {
      sessionId: session.id,
    })
    throw new Error('No user ID found in session metadata')
  }

  if (amount <= 0) {
    logger.error('Invalid amount', { amount, sessionId: session.id })
    throw new Error('Invalid amount')
  }

  logger.info(`Updating credits for user ${clerkUserId}: +${amount} credits`)

  // Update credits in the database
  const updatedUser = await prisma.user.update({
    where: { clerkUserId },
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
    `Credits updated successfully for user ${clerkUserId}. New balance: ${updatedUser.credits}`
  )
}
