'use client'

import { PricingSection } from '@/components/pricing-section'
import { BackgroundPattern } from '@/components/ui/background-pattern'
import { Button } from '@/components/ui/button'
import { HeroIllustration } from '@/components/ui/hero-illustration'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const initialAnimation = mounted ? { opacity: 0, y: 20 } : undefined
  const animateAnimation = mounted ? { opacity: 1, y: 0 } : undefined
  const initialScale = mounted ? { scale: 0.95, opacity: 0 } : undefined
  const animateScale = mounted ? { scale: 1, opacity: 1 } : undefined

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <BackgroundPattern />
        <motion.div
          initial={initialAnimation}
          animate={animateAnimation}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center z-10 relative"
        >
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={initialScale}
              animate={animateScale}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                AI-Powered Cover Letters
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Create Perfect Cover Letters with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Generate professional, tailored cover letters in minutes using
              advanced AI technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
        <HeroIllustration />
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800"
      >
        <motion.div
          initial={initialAnimation}
          whileInView={animateAnimation}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={initialScale}
              whileInView={animateScale}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Why Choose Us
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Coveri?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform makes creating professional cover letters
              easier than ever
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Generation',
                description:
                  'Our advanced AI analyzes job descriptions and your experience to create tailored cover letters.',
                icon: '🤖',
                gradientClass: 'from-blue-500 to-indigo-500',
              },
              {
                title: 'Professional Templates',
                description:
                  'Choose from a variety of professionally designed templates that match your industry.',
                icon: '📄',
                gradientClass: 'from-indigo-500 to-purple-500',
              },
              {
                title: 'Easy Customization',
                description:
                  'Fine-tune your cover letter with our intuitive editing tools and suggestions.',
                icon: '✨',
                gradientClass: 'from-purple-500 to-pink-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={initialAnimation}
                whileInView={animateAnimation}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10`}
                />
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group-hover:border-transparent relative z-10">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <PricingSection />
    </div>
  )
}
