'use server'

import { stripe } from '@/lib/stripe'

export async function createCheckoutSession(amount: number) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error('NEXT_PUBLIC_SERVER_URL is not set')
    }

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

    console.log('Creating checkout session with URLs:', {
      successUrl: successUrl.toString(),
      cancelUrl: cancelUrl.toString(),
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${amount} Credits`,
              description: 'Cover letter generation credits',
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
    })

    if (!session.url) {
      throw new Error('Failed to create checkout session: No URL returned')
    }

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`)
    }
    throw new Error('Failed to create checkout session: Unknown error')
  }
}
