import { stripe } from '@/lib/stripe'
import { prisma } from '@/prisma/prisma'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

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
      console.log('TEST MODE: Bypassing signature verification')
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
    }

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
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

  // Extract the necessary data
  const amount = session.amount_total ? session.amount_total / 100 : 0
  const clerkUserId = session.metadata?.userId

  if (!clerkUserId) {
    throw new Error('No user ID found in session metadata')
  }

  if (amount <= 0) {
    throw new Error('Invalid amount')
  }

  console.log(`Updating credits for user ${clerkUserId}: +${amount} credits`)

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

  console.log(
    `Credits updated successfully. New balance: ${updatedUser.credits}`
  )
}
