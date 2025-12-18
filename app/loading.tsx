"use client"

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Custom spinner with gradient */}
        <div className="relative w-16 h-16">
          {/* Outer spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="90 90"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(var(--color-primary))" />
                  <stop offset="100%" stopColor="oklch(var(--color-accent))" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Inner pulsing circle */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 blur-sm"
          />
        </div>

        {/* Loading text with animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-lg font-medium text-foreground">Loading Tools</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-lg font-medium text-muted-foreground"
          >
            ...
          </motion.span>
        </motion.div>

        {/* Optional subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Brewing awesomeness
        </motion.p>
      </motion.div>
    </div>
  )
}
