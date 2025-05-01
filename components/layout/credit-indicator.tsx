'use client'

import { useCredits } from '@/hooks/use-credits'
import { motion } from 'framer-motion'
import { Coins, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function CreditIndicator() {
  const { credits, isLoading } = useCredits()

  return (
    <Link href="/dashboard/plan">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-100 dark:border-blue-900 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/70 dark:hover:to-indigo-900/70 transition-colors cursor-pointer group"
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur transition duration-200" />
          <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400 relative" />
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : credits === 0 ? (
            'No Credits'
          ) : (
            credits
          )}
        </span>
      </motion.div>
    </Link>
  )
}
