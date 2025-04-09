import { stripe } from '@/lib/stripe'
import { prisma } from '@/prisma/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Ensure this route is accessible
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature')

  if (!signature) {
    return new NextResponse('No signature found', { status: 400 })
  }

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const amount = session.amount_total ? session.amount_total / 100 : 0
      const clerkUserId = session.metadata?.userId

      if (!clerkUserId) {
        throw new Error('No user ID found in session metadata')
      }

      if (amount <= 0) {
        throw new Error('Invalid amount')
      }

      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId },
        select: { credits: true, clerkUserId: true },
      })

      if (!existingUser) {
        throw new Error(`User not found with clerkUserId: ${clerkUserId}`)
      }

      await prisma.user.update({
        where: { clerkUserId },
        data: {
          credits: {
            increment: amount,
          },
        },
      })

      return new NextResponse(null, { status: 200 })
    } catch (error) {
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
