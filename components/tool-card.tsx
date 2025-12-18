"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Tool, ToolCategory } from "@/constants/tool-registry"
import { ArrowRight, Sparkles, Code, Search, ImageIcon, Repeat, PenLine, Wrench, type LucideIcon } from "lucide-react"

const categoryIcons: Record<ToolCategory, LucideIcon> = {
  AI: Sparkles,
  Dev: Code,
  SEO: Search,
  Image: ImageIcon,
  Converter: Repeat,
  Writing: PenLine,
  General: Wrench,
}

const categoryColors: Record<ToolCategory, string> = {
  AI: "from-primary to-accent",
  Dev: "from-chart-3 to-chart-4",
  SEO: "from-chart-5 to-primary",
  Image: "from-accent to-chart-2",
  Converter: "from-chart-4 to-chart-5",
  Writing: "from-purple-500 to-pink-500",
  General: "from-slate-500 to-zinc-600",
}

// Default fallback icon and color for unknown categories
const DEFAULT_ICON = Wrench
const DEFAULT_COLOR = "from-slate-500 to-zinc-600"

interface ToolCardProps {
  tool: Tool
  index: number
}

export function ToolCard({ tool, index }: ToolCardProps) {
  // Safe access with fallback to prevent undefined component errors
  const Icon = categoryIcons[tool.category] || DEFAULT_ICON
  const colorGradient = categoryColors[tool.category] || DEFAULT_COLOR

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      <Link href={`/tools/${tool.slug}`} className="block h-full">
        <Card className="group relative h-full overflow-hidden border-border/60 bg-card/90 backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 gradient-border">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
          />

          <CardHeader className="relative">
            <div className="mb-3 flex items-start justify-between">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colorGradient} shadow-lg`}
              >
                <Icon className="h-5 w-5 text-white" />
              </motion.div>
              {tool.featured && (
                <Badge variant="secondary" className="text-xs font-semibold">
                  Featured
                </Badge>
              )}
            </div>

            <CardTitle className="mb-2 flex items-center justify-between text-foreground font-bold">
              <span className="text-balance leading-snug">{tool.title}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
            </CardTitle>

            <CardDescription className="text-pretty leading-relaxed text-muted-foreground">
              {tool.description}
            </CardDescription>

            {tool.tags && tool.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs font-medium border-border/50">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  )
}
