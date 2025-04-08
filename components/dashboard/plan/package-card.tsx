import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CreditPackage } from '@/types/dashboard-plan.types'
import { CreditCard, Loader2, Package } from 'lucide-react'

interface PackageCardProps {
  pack: CreditPackage
  onPurchase: (credits: number) => void
  isPurchasing: boolean
}

export const PackageCard = ({
  pack,
  onPurchase,
  isPurchasing,
}: PackageCardProps) => (
  <Card
    className={cn(
      'p-6 hover:shadow-lg transition-shadow',
      pack.isPremium &&
        'border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50'
    )}
  >
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="p-3 bg-purple-100 dark:bg-purple-900 w-fit rounded-lg mb-4">
          <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{pack.title}</h3>
          {pack.isPremium && (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full">
              Best Value
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">{pack.description}</p>
      </div>
      <div className="mt-auto">
        <div className="mb-4">
          <p className="text-3xl font-bold">${pack.price}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            for {pack.credits} credits
          </p>
        </div>
        <Button
          className={cn(
            'w-full',
            pack.isPremium && 'bg-purple-600 hover:bg-purple-700 text-white'
          )}
          onClick={() => onPurchase(pack.credits)}
          disabled={isPurchasing}
        >
          {isPurchasing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          {pack.isPremium ? 'Purchase Premium' : 'Purchase Now'}
        </Button>
      </div>
    </div>
  </Card>
)
