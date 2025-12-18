"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        {/* Glass card container */}
        <div className="glass-card p-8 md:p-12 rounded-2xl shadow-2xl">
          {/* Animated 404 icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl rounded-full" />
              <AlertCircle className="w-24 h-24 text-primary relative z-10" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold mb-6 text-foreground"
          >
            Page Not Found
          </motion.h2>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg text-muted-foreground mb-4"
          >
            Oops! Looks like you&apos;ve ventured into uncharted digital territory.
          </motion.p>

          {/* Body text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-base text-muted-foreground/80 mb-8 leading-relaxed max-w-lg mx-auto"
          >
            The tool or page you&apos;re looking for might have been moved, removed, or never existed. Don&apos;t worry,
            we&apos;ll help you find your way back.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto bg-transparent">
              <Link href="/#search">
                <Search className="w-4 h-4" />
                Search for a tool
              </Link>
            </Button>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <p className="text-sm text-muted-foreground/60">
              Lost? Try using the search function or explore our tools from the homepage.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
