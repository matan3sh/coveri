'use client'

import { updateCoverLetter } from '@/actions/update-cover-letter'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

interface EditCoverLetterDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialContent: string
  coverLetterId: string
}

export function EditCoverLetterDialog({
  isOpen,
  onOpenChange,
  initialContent,
  coverLetterId,
}: EditCoverLetterDialogProps) {
  const [editedContent, setEditedContent] = useState(initialContent)
  const [isPending, startTransition] = useTransition()

  const handleCopyFromDialog = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
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

  const handleSave = async () => {
    startTransition(async () => {
      try {
        const result = await updateCoverLetter({
          id: coverLetterId,
          content: editedContent,
        })

        if (!result.success) {
          throw new Error(result.error || 'Failed to update cover letter')
        }

        toast.success('Cover letter updated successfully!')
        onOpenChange(false)
      } catch (error) {
        toast.error('Failed to update cover letter', {
          description:
            error instanceof Error ? error.message : 'Please try again.',
          duration: 3000,
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Cover Letter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {editedContent.length}/1000 characters
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCopyFromDialog}
              className="flex items-center gap-1.5"
              disabled={isPending}
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-1.5"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
