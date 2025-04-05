'use client'

import { CoverLetterForm } from '@/components/dashboard/cover-letter/cover-letter-form'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'

export default function CreatePage() {
  return (
    <div className="relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-4 relative z-10 h-full"
      >
        <div className="max-w-4xl mx-auto pb-4 flex flex-col">
          <div className="flex-none">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Cover Letter
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              Start crafting your perfect cover letter.
            </p>
          </div>
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <CoverLetterForm />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
