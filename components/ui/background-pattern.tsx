'use client'

import { motion } from 'framer-motion'

export function BackgroundPattern() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Abstract shapes */}
      <motion.svg
        className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-10"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#3B82F6', stopOpacity: 0.2 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#60A5FA', stopOpacity: 0.1 }}
            />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#2563EB', stopOpacity: 0.1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#93C5FD', stopOpacity: 0.2 }}
            />
          </linearGradient>
        </defs>

        {/* Animated blobs */}
        <motion.path
          d="M500,300 Q650,150 800,300 T1100,300 T1400,300 T1700,300"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M200,500 Q350,650 500,500 T800,500 T1100,500"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
        />

        {/* Decorative circles */}
        {[...Array(20)].map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r={Math.random() * 4 + 1}
            fill={Math.random() > 0.5 ? 'url(#gradient1)' : 'url(#gradient2)'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </motion.svg>
    </div>
  )
}
