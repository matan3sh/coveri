'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Coins, CreditCard } from 'lucide-react'
import Link from 'next/link'

export function NoCreditsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[400px] bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 blur-xl" />
        <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full">
          <Coins className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        No Credits Available
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        You need at least one credit to generate a cover letter. Purchase
        credits to continue creating professional cover letters for your job
        applications.
      </p>

      <Link href="/dashboard/plan">
        <Button size="lg" className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Purchase Credits
        </Button>
      </Link>
    </motion.div>
  )
}
