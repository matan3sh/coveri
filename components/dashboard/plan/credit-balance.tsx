import { Card } from '@/components/ui/card'
import { Coins, Loader2 } from 'lucide-react'

interface CreditBalanceProps {
  credits: number | null
  isLoading: boolean
}

export const CreditBalance = ({ credits, isLoading }: CreditBalanceProps) => (
  <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-100 dark:border-blue-900">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Available Credits
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            credits ?? 0
          )}
        </h2>
      </div>
    </div>
  </Card>
)
