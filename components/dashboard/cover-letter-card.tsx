'use client'

import { Button } from '@/components/ui/button'
import { type CoverLetter } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  Copy,
  Edit2,
  ExternalLink,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EditCoverLetterDialog } from './edit-cover-letter-dialog'

interface CoverLetterCardProps {
  coverLetter: CoverLetter
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

export function CoverLetterCard({ coverLetter }: CoverLetterCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter.coverLetter)
      toast.success('Cover letter copied to clipboard!', {
        description: 'You can now paste it anywhere you need.',
        duration: 3000,
      })
    } catch {
      toast.error('Failed to copy cover letter', {
        description: 'Please try again or copy manually.',
        duration: 3000,
      })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {coverLetter.jobTitle}
            </h3>
          </div>
          <a
            href={coverLetter.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            {coverLetter.companyWebsite}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium',
            coverLetter.writingStyle === 'FORMAL'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          )}
        >
          {coverLetter.writingStyle}
        </span>
      </div>

      {/* Content Preview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-800 pointer-events-none" />
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
          {coverLetter.coverLetter}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(new Date(coverLetter.createdAt))}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(coverLetter.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Copy</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit2 className="h-4 w-4" />
            <span className="text-sm">Edit</span>
          </Button>
        </div>
      </div>

      <EditCoverLetterDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialContent={coverLetter.coverLetter}
        coverLetterId={coverLetter.id}
      />
    </div>
  )
}
