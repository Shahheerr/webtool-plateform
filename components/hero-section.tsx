"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/30 to-primary/10 blur-[140px]"
          animate={{
            x: [0, 120, 0],
            y: [0, 60, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-accent/30 to-accent/10 blur-[140px]"
          animate={{
            x: [0, -120, 0],
            y: [0, -60, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-primary shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>100+ Powerful Tools in One Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-balance text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Your Complete{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Web Tools
            </span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            AI-powered utilities, SEO tools, developer resources, and more. Everything you need to boost your
            productivity and creativity in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="group gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link href="#tools">
                  Explore Tools
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="glass-panel bg-transparent backdrop-blur-md shadow-md hover:shadow-lg"
                asChild
              >
                <Link href="#categories">Browse Categories</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border border-border/60 bg-muted/80 backdrop-blur-sm px-2 font-mono text-xs font-medium text-foreground shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>{" "}
            to search
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
