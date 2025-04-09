'use server'

import { stripe } from '@/lib/stripe'
import { auth } from '@clerk/nextjs/server'

export async function createCheckoutSession(amount: number) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      throw new Error('User not authenticated')
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error('NEXT_PUBLIC_SERVER_URL is not set')
    }

    console.log(
      'Creating checkout session for user:',
      clerkUserId,
      'amount:',
      amount
    )

    const successUrl = new URL(
      '/dashboard/plan',
      process.env.NEXT_PUBLIC_SERVER_URL
    )
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('amount', amount.toString())

    const cancelUrl = new URL(
      '/dashboard/plan',
      process.env.NEXT_PUBLIC_SERVER_URL
    )
    cancelUrl.searchParams.set('canceled', 'true')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${amount} Credits`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        userId: clerkUserId, // This is the Clerk user ID
      },
    })

    console.log('Checkout session created:', {
      id: session.id,
      url: session.url,
      clerkUserId,
      metadata: session.metadata,
      successUrl: successUrl.toString(),
      cancelUrl: cancelUrl.toString(),
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
