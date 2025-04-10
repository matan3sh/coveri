'use client'

import { getCoverLetters } from '@/actions/get-cover-letters'
import { CoverLetterCard } from '@/components/dashboard/cover-letter-card'
import { CoverLetterCardSkeleton } from '@/components/dashboard/cover-letter-card-skeleton'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Header } from '@/components/dashboard/layout/header'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { type CoverLetter } from '@/lib/schemas'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        const result = await getCoverLetters()
        if (result.success && result.data) {
          setCoverLetters(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch cover letters:', error)
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
        <div className="max-w-4xl mx-auto pb-4 flex flex-col h-full">
          <Header
            isLoading={isLoading}
            coverLettersCount={coverLetters.length}
          />
          <div className="flex-1 overflow-auto space-y-4">
            {isLoading ? (
              <>
                <CoverLetterCardSkeleton />
                <CoverLetterCardSkeleton />
                <CoverLetterCardSkeleton />
              </>
            ) : coverLetters.length > 0 ? (
              coverLetters.map((coverLetter) => (
                <CoverLetterCard
                  key={coverLetter.id}
                  coverLetter={coverLetter}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
