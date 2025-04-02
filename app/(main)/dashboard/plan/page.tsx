'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'

export default function PlanPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Manage your subscription and billing details.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
