'use client'

import { CoverLetterForm } from '@/components/cover-letter-form'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { motion } from 'framer-motion'

export default function CreatePage() {
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
            Create New Cover Letter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Start crafting your perfect cover letter.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <CoverLetterForm />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
