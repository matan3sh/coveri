import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  isLoading: boolean
  coverLettersCount: number
}

export function Header({ isLoading, coverLettersCount }: HeaderProps) {
  const { user } = useUser()

  return (
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
            ) : coverLettersCount > 0 ? (
              `You have ${coverLettersCount} cover letter${
                coverLettersCount === 1 ? '' : 's'
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
  )
}
