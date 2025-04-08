'use client'

import { purchaseCredits } from '@/actions/manage-credits'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'sonner'

import { CreditBalance } from '@/components/dashboard/plan/credit-balance'
import { PackageCard } from '@/components/dashboard/plan/package-card'
import { useCredits } from '../../../../hooks/use-credits'
import { creditPackages } from '../../../../types/dashboard-plan.types'

export default function PlanPage() {
  const { credits, isLoading, loadCredits } = useCredits()
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePurchase = async (amount: number) => {
    setIsPurchasing(true)
    try {
      const result = await purchaseCredits(amount)
      if (result.success) {
        await loadCredits() // Reload credits after successful purchase
        toast.success(`Successfully purchased ${amount} credits!`)
      } else {
        toast.error('Failed to purchase credits')
      }
    } catch {
      toast.error('Failed to purchase credits')
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
            {creditPackages.map((pack) => (
              <PackageCard
                key={pack.id}
                pack={pack}
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
