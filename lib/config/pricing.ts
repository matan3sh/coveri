export interface PricingPlan {
  id: string
  name: string
  price: number
  credits: number
  features: string[]
  cta: string
  href: string
  popular: boolean
}

export const CREDITS_PER_PACKAGE = 5
export const PRICE_PER_PACKAGE = 3

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    price: PRICE_PER_PACKAGE,
    credits: CREDITS_PER_PACKAGE,
    features: [
      '5 cover letter credits',
      'Basic AI customization',
      'Standard templates',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: PRICE_PER_PACKAGE * 3,
    credits: CREDITS_PER_PACKAGE * 4,
    features: [
      '20 cover letter credits',
      'Advanced AI customization',
      'Premium templates',
      'Priority support',
      'Resume integration',
      'Custom branding',
    ],
    cta: 'Get Premium',
    href: '/signup?plan=premium',
    popular: true,
  },
]
