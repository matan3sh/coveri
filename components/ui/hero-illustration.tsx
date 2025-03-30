'use client'

import { motion } from 'framer-motion'

export function HeroIllustration() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-70 dark:opacity-40 pointer-events-none hidden lg:block">
      <motion.svg
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="heroGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#60A5FA', stopOpacity: 0.2 }}
            />
          </linearGradient>
          <linearGradient
            id="heroGradient2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: '#2563EB', stopOpacity: 0.2 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#93C5FD', stopOpacity: 0.3 }}
            />
          </linearGradient>
        </defs>

        {/* Document shape */}
        <motion.path
          d="M100,100 L300,100 L300,400 L100,400 Z"
          fill="white"
          stroke="url(#heroGradient1)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Text lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="120"
            y1={150 + i * 30}
            x2={280 - Math.random() * 50}
            y2={150 + i * 30}
            stroke="url(#heroGradient2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.1 * i }}
          />
        ))}

        {/* AI sparkles */}
        {[...Array(10)].map((_, i) => (
          <motion.circle
            key={`sparkle-${i}`}
            cx={350 + Math.random() * 100}
            cy={150 + Math.random() * 200}
            r="2"
            fill="#60A5FA"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ))}

        {/* Connection lines */}
        <motion.path
          d="M300,250 C350,250 350,150 400,150 M300,300 C350,300 350,350 400,350"
          fill="none"
          stroke="url(#heroGradient1)"
          strokeWidth="1.5"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 2, delay: 1 }}
        />
      </motion.svg>
    </div>
  )
}
