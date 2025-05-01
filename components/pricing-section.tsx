'use client'

import { PackageCard } from '@/components/dashboard/plan/package-card'
import { pricingPlans } from '@/lib/config/pricing'
import { motion } from 'framer-motion'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function PricingSection() {
  const [isPurchasing, setIsPurchasing] = useState(false)

  const handlePurchase = async (amount: number) => {
    setIsPurchasing(true)
    try {
      // Redirect to signup page with the selected plan
      window.location.href = `/signup?plan=${
        amount === 5 ? 'basic' : 'premium'
      }`
    } catch (error) {
      console.error('Purchase error:', error)
    } finally {
      setIsPurchasing(false)
    }
  }

  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include our core
          AI-powered cover letter generation.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
      >
        {pricingPlans.map((plan) => (
          <motion.div key={plan.id} variants={item}>
            <PackageCard
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
