import { getUserCredits } from '@/actions/manage-credits'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useCredits = () => {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadCredits = async () => {
    setIsLoading(true)
    try {
      const result = await getUserCredits()
      if (result.success && result.credits !== undefined) {
        setCredits(result.credits)
      } else {
        toast.error(result.error || 'Failed to load credits')
      }
    } catch {
      toast.error('Failed to load credits')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCredits()
  }, [])

  return { credits, isLoading, loadCredits }
}
