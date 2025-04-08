export interface CreditPackage {
  id: string
  title: string
  description: string
  credits: number
  price: number
  isPremium?: boolean
}

export const CREDITS_PER_PACKAGE = 5
export const PRICE_PER_PACKAGE = 3

export const creditPackages: CreditPackage[] = [
  {
    id: 'basic',
    title: 'Basic Package',
    description: 'Get started with a small pack of credits',
    credits: CREDITS_PER_PACKAGE,
    price: PRICE_PER_PACKAGE,
  },
  {
    id: 'premium',
    title: 'Premium Package',
    description: 'Save more with our premium credit pack',
    credits: CREDITS_PER_PACKAGE * 4,
    price: PRICE_PER_PACKAGE * 3,
    isPremium: true,
  },
]
