import { stripe } from '@/lib/stripe'
import { prisma } from '@/prisma/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature')

  if (!signature) {
    return new NextResponse('No signature found', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    try {
      // Get the user's email from the session
      const email = session.customer_email

      if (!email) {
        throw new Error('No email found in session')
      }

      // Get the amount from the line items
      const amount = session.amount_total ? session.amount_total / 100 : 0 // Convert from cents to dollars

      if (amount <= 0) {
        throw new Error('Invalid amount')
      }

      // Update user's credits
      await prisma.user.update({
        where: { email },
        data: {
          credits: {
            increment: amount,
          },
        },
      })

      console.log(`Successfully added ${amount} credits to user ${email}`)
      return new NextResponse(null, { status: 200 })
    } catch (error) {
      console.error('Error processing webhook:', error)
      return new NextResponse(
        `Error processing webhook: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        { status: 500 }
      )
    }
  }

  return new NextResponse(null, { status: 200 })
}
