import { purchaseCredits } from '@/actions/manage-credits'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  console.log('Webhook received')
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature')

  if (!signature) {
    console.error('No signature found in webhook')
    return new NextResponse('No signature found', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('Webhook event type:', event.type)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  console.log('Session data:', {
    id: session.id,
    customer_email: session.customer_email,
    amount_total: session.amount_total,
  })

  if (event.type === 'checkout.session.completed') {
    try {
      // Get the amount from the line items
      const amount = session.amount_total ? session.amount_total / 100 : 0 // Convert from cents to dollars
      console.log('Processing payment for amount:', amount)

      if (amount <= 0) {
        console.error('Invalid amount:', amount)
        throw new Error('Invalid amount')
      }

      // Use the purchaseCredits server action to update credits
      const result = await purchaseCredits(amount)

      if (!result.success) {
        console.error('Failed to update credits:', result.error)
        throw new Error(result.error || 'Failed to update credits')
      }

      console.log('Successfully updated credits:', {
        amount,
        newBalance: result.credits,
      })
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
