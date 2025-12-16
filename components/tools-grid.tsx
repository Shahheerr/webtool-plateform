"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ToolCard } from "@/components/tool-card"
import { TOOL_REGISTRY, getAllCategories, getToolsByCategory, getFeaturedTools } from "@/constants/tool-registry"

export function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const categories = getAllCategories()

  const displayedTools =
    activeCategory === "all"
      ? TOOL_REGISTRY
      : activeCategory === "featured"
        ? getFeaturedTools()
        : getToolsByCategory(activeCategory as any)

  return (
    <section id="tools" className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">Explore Our Tools</h2>
        <p className="text-pretty text-lg text-muted-foreground">
          Browse through our collection of powerful utilities and tools
        </p>
      </motion.div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="mb-8 flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-lg border border-border/50 bg-card/50 px-4 py-2 data-[state=active]:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All Tools
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="rounded-lg border border-border/50 bg-card/50 px-4 py-2 data-[state=active]:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Featured
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="rounded-lg border border-border/50 bg-card/50 px-4 py-2 data-[state=active]:border-primary/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
