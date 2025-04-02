'use client'

import { BackgroundPattern } from '@/components/ui/background-pattern'
import { SignIn } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-gray-900">
      <BackgroundPattern />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto px-4"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200">
              Welcome Back
            </span>
          </motion.div>
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Sign in to Coveri
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create perfect cover letters with AI
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[0_0_1px_1px_rgba(255,255,255,0.05)]">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'bg-transparent p-8',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl transition-all duration-200',
                socialButtonsBlockButtonText:
                  'text-gray-900 dark:text-white font-medium',
                socialButtonsBlockButtonArrow: 'text-gray-900 dark:text-white',
                dividerText: 'text-gray-400 dark:text-gray-500',
                dividerLine: 'bg-gray-100 dark:bg-gray-700',
                formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium',
                formFieldInput:
                  'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200',
                formFieldInputShowPasswordButton:
                  'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                footerActionLink:
                  'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium',
                formButtonPrimary:
                  'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 h-11',
                formFieldErrorText:
                  'text-red-500 dark:text-red-400 text-sm mt-1',
                formFieldSuccessText:
                  'text-green-500 dark:text-green-400 text-sm mt-1',
                formFieldInputGroup: 'relative',
                formFieldInputGroupInput: 'pl-10',
                formFieldInputGroupPrefix:
                  'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500',
                formFieldInputGroupSuffix:
                  'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500',
                card__main: 'gap-4',
                socialButtonsProviderIcon: 'w-5 h-5',
                socialButtonsBlockButtonArrowBox: 'hidden',
                dividerContainer: 'my-6',
                formButtonPrimaryArrow: 'hidden',
                footer: 'hidden',
                formFieldLabelRow: 'mb-1.5',
                formFieldRow: 'mb-4',
                form: 'gap-4',
                socialButtonsProviderMore: 'hidden',
                socialButtonsBlockButtonIconBox: 'mr-3',
              },
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
              },
            }}
            afterSignInUrl="/dashboard"
            redirectUrl="/dashboard"
            routing="path"
            path="/sign-in"
          />
        </div>
      </motion.div>
    </div>
  )
}
