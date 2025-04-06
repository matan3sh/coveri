'use client'

import { getCoverLetters } from '@/actions/get-cover-letters'
import { CoverLetterCard } from '@/components/dashboard/cover-letter-card'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { type CoverLetter } from '@/lib/types/cover-letter'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function CoverLetterCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Content Preview */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        const result = await getCoverLetters()
        if (result.success && result.coverLetters) {
          setCoverLetters(result.coverLetters)
        }
      } catch (error) {
        console.error('Error fetching cover letters:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoverLetters()
  }, [])

  return (
    <div className="relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-4 relative z-10 h-full"
      >
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-none">
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Hello, {user?.firstName || 'there'}!
                </h1>
                <div className="text-base text-gray-600 dark:text-gray-300">
                  {isLoading ? (
                    <Skeleton className="h-5 w-48" />
                  ) : coverLetters.length > 0 ? (
                    `You have ${coverLetters.length} cover letter${
                      coverLetters.length === 1 ? '' : 's'
                    }`
                  ) : (
                    'Create your first cover letter to get started'
                  )}
                </div>
              </div>
              <Link href="/dashboard/create">
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  New Cover Letter
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {[...Array(2)].map((_, index) => (
                  <CoverLetterCardSkeleton key={index} />
                ))}
              </div>
            ) : coverLetters.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {coverLetters.map((coverLetter) => (
                  <CoverLetterCard
                    key={coverLetter.id}
                    coverLetter={coverLetter}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Cover Letters Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                  Create your first cover letter to get started with your job
                  search
                </p>
                <Link href="/dashboard/create">
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Create Cover Letter
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
