import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No Cover Letters Yet
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
        Create your first cover letter to get started with your job search
      </p>
      <Link href="/dashboard/create">
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Create Cover Letter
        </Button>
      </Link>
    </div>
  )
}
