'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 inline-block"
          >
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Get Started
            </span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join Coveri and create perfect cover letters
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white',
                socialButtonsBlockButtonText: 'text-gray-900 dark:text-white',
                socialButtonsBlockButtonArrow: 'text-gray-900 dark:text-white',
                dividerText: 'text-gray-500 dark:text-gray-400',
                dividerLine: 'bg-gray-200 dark:bg-gray-700',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                formFieldInput:
                  'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white',
                footerActionLink:
                  'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
              },
            }}
            afterSignUpUrl="/dashboard"
            signInUrl="/sign-in"
            redirectUrl="/dashboard"
            routing="path"
            path="/sign-up"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
