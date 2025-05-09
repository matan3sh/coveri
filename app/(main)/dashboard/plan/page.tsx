'use client'

import { createCheckoutSession } from '@/actions/create-checkout-session'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CreditBalance } from '@/components/dashboard/plan/credit-balance'
import { PackageCard } from '@/components/dashboard/plan/package-card'
import { useCredits } from '@/hooks/use-credits'
import { pricingPlans } from '@/lib/config/pricing'

export default function PlanPage() {
  const { credits, isLoading, loadCredits } = useCredits()
  const [isPurchasing, setIsPurchasing] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    const error = searchParams.get('error')
    const amount = searchParams.get('amount')

    if (success === 'true' && amount) {
      toast.success(`Successfully added ${amount} credits to your account!`)
      loadCredits()
      router.replace('/dashboard/plan')
    } else if (canceled === 'true') {
      toast.info('Purchase was canceled')
      router.replace('/dashboard/plan')
    } else if (error) {
      toast.error(`Purchase failed: ${error}`)
      router.replace('/dashboard/plan')
    }
  }, [searchParams, loadCredits, router])

  const handlePurchase = async (amount: number) => {
    setIsPurchasing(true)
    try {
      const { url } = await createCheckoutSession(amount)
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Purchase error:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to initiate purchase')
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Your Credits
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Purchase credits to generate more cover letters
            </p>
          </div>

          <CreditBalance credits={credits} isLoading={isLoading} />

          <div className="grid gap-6 md:grid-cols-2">
            {pricingPlans.map((plan) => (
              <PackageCard
                key={plan.id}
                pack={{
                  id: plan.id,
                  title: plan.name,
                  description: `Get ${plan.credits} credits for your cover letters`,
                  credits: plan.credits,
                  price: plan.price,
                  isPremium: plan.popular,
                }}
                onPurchase={handlePurchase}
                isPurchasing={isPurchasing}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
