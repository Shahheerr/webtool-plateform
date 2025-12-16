"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { TOOL_REGISTRY, type Tool } from "@/constants/tool-registry"
import { Sparkles, Code, SearchIcon, ImageIcon, Repeat } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const categoryIcons = {
  AI: Sparkles,
  Dev: Code,
  SEO: SearchIcon,
  Image: ImageIcon,
  Converter: Repeat,
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTools, setFilteredTools] = useState<Tool[]>(TOOL_REGISTRY)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = TOOL_REGISTRY.filter(
        (tool) =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredTools(filtered)
    } else {
      setFilteredTools(TOOL_REGISTRY)
    }
  }, [searchQuery])

  const handleSelect = (slug: string) => {
    onOpenChange(false)
    router.push(`/tools/${slug}`)
  }

  const groupedTools = filteredTools.reduce(
    (acc, tool) => {
      if (!acc[tool.category]) {
        acc[tool.category] = []
      }
      acc[tool.category].push(tool)
      return acc
    },
    {} as Record<string, Tool[]>,
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for tools... (Ctrl+K)" value={searchQuery} onValueChange={setSearchQuery} />
      <CommandList>
        <CommandEmpty>No tools found.</CommandEmpty>
        {Object.entries(groupedTools).map(([category, tools]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <CommandGroup key={category} heading={category}>
              {tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={tool.title}
                  onSelect={() => handleSelect(tool.slug)}
                  className="flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  <div className="flex flex-col">
                    <span className="font-medium">{tool.title}</span>
                    <span className="text-xs text-muted-foreground">{tool.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}
