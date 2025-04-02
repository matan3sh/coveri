'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user } = useUser()

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
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 inline-block"
          >
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Welcome Back
            </span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hello, {user?.firstName || 'there'}!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Your dashboard is coming soon. Stay tuned for updates!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
