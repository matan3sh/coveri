'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'

export default function PlanPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-4 relative z-10 h-full"
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-none">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Plan
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              Manage your subscription and billing details.
            </p>
          </div>
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Plan content will go here */}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
