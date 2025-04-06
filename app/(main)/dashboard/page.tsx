'use client'

import { getCoverLetters } from '@/actions/get-cover-letters'
import { CoverLetterCard } from '@/components/dashboard/cover-letter-card'
import { CoverLetterCardSkeleton } from '@/components/dashboard/cover-letter-card-skeleton'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Header } from '@/components/dashboard/layout/header'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { type CoverLetter } from '@/lib/types/cover-letter'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
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
          <Header
            isLoading={isLoading}
            coverLettersCount={coverLetters.length}
          />
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
              <EmptyState />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
