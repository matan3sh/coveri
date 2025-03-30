'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Basic',
    price: '$5',
    features: [
      'Generate 5 cover letters per month',
      'Basic AI customization',
      'Standard templates',
      'Email support',
    ],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$15',
    features: [
      'Unlimited cover letters',
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function PricingSection() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the plan that best fits your needs. All plans include our core
          AI-powered cover letter generation.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
      >
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={item}
            className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border ${
              plan.popular
                ? 'border-blue-500 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {plan.price}
                <span className="text-base font-normal text-gray-600 dark:text-gray-400">
                  /month
                </span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href={plan.href}>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
