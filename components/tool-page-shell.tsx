"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { Tool, ToolCategory } from "@/constants/tool-registry"
import { Sparkles, Code, Search, ImageIcon, Repeat, PenLine, Wrench, type LucideIcon } from "lucide-react"

const categoryIcons: Record<ToolCategory, LucideIcon> = {
  AI: Sparkles,
  Dev: Code,
  SEO: Search,
  Image: ImageIcon,
  Converter: Repeat,
  Writing: PenLine,
  General: Wrench,
}

// Default fallback icon for unknown categories
const DEFAULT_ICON = Wrench

interface ToolPageShellProps {
  tool: Tool
  children: React.ReactNode
}

export function ToolPageShell({ tool, children }: ToolPageShellProps) {
  // Safe access with fallback to prevent undefined component errors
  const Icon = categoryIcons[tool.category] || DEFAULT_ICON

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/50 backdrop-blur-xl bg-card/40 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-xl"
              >
                <Icon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="font-semibold">
                    {tool.category}
                  </Badge>
                  {tool.featured && (
                    <Badge variant="outline" className="font-semibold">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-balance text-3xl font-extrabold text-foreground md:text-4xl">{tool.title}</h1>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{tool.description}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  )
}
