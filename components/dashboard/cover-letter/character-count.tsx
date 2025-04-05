import { cn } from '@/lib/utils'
import { type CharacterCountProps } from './types'

export function CharacterCount({
  current,
  max,
  warningThreshold = 0.8,
  errorThreshold = 0.95,
}: CharacterCountProps) {
  const warningCount = max * warningThreshold
  const errorCount = max * errorThreshold

  return (
    <span
      className={cn(
        'text-sm',
        current > warningCount && 'text-yellow-500',
        current > errorCount && 'text-red-500'
      )}
    >
      {current}/{max}
    </span>
  )
}
