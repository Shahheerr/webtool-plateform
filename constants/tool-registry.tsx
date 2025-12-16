/**
 * Tool Registry - Single Source of Truth
 * All tool metadata and routing configuration
 */

export type ToolArchetype = "text" | "file" | "form"

export type ToolCategory = "AI" | "SEO" | "Dev" | "Image" | "Converter"

export interface Tool {
  id: string
  title: string
  slug: string
  description: string
  category: ToolCategory
  archetype: ToolArchetype
  icon?: string
  featured?: boolean
  tags?: string[]
}

/**
 * Complete Tool Registry
 * Add new tools here to automatically integrate them into the platform
 */
export const TOOL_REGISTRY: Tool[] = [
  // AI Tools
  {
    id: "ai-story-generator",
    title: "AI Story Generator",
    slug: "ai-story-generator",
    description: "Generate creative stories using AI with customizable themes and styles",
    category: "AI",
    archetype: "text",
    featured: true,
    tags: ["ai", "creative", "writing"],
  },
  {
    id: "ai-content-improver",
    title: "AI Content Improver",
    slug: "ai-content-improver",
    description: "Enhance your content with AI-powered suggestions and improvements",
    category: "AI",
    archetype: "text",
    featured: true,
    tags: ["ai", "content", "optimization"],
  },
  {
    id: "plagiarism-checker",
    title: "Plagiarism Checker",
    slug: "plagiarism-checker",
    description: "Check your content for plagiarism and get originality scores",
    category: "AI",
    archetype: "text",
    tags: ["ai", "plagiarism", "analysis"],
  },

  // SEO Tools
  {
    id: "meta-tag-generator",
    title: "Meta Tag Generator",
    slug: "meta-tag-generator",
    description: "Generate SEO-optimized meta tags for your website",
    category: "SEO",
    archetype: "form",
    featured: true,
    tags: ["seo", "meta", "optimization"],
  },
  {
    id: "domain-checker",
    title: "Domain Availability Checker",
    slug: "domain-checker",
    description: "Check domain availability across multiple TLDs instantly",
    category: "SEO",
    archetype: "form",
    tags: ["seo", "domain", "availability"],
  },

  // Dev Tools
  {
    id: "code-beautifier",
    title: "Code Beautifier",
    slug: "code-beautifier",
    description: "Format and beautify your code with syntax highlighting",
    category: "Dev",
    archetype: "text",
    featured: true,
    tags: ["dev", "code", "formatting"],
  },
  {
    id: "hex-to-rgb",
    title: "Hex to RGB Converter",
    slug: "hex-to-rgb",
    description: "Convert colors between Hex, RGB, and HSL formats",
    category: "Dev",
    archetype: "form",
    tags: ["dev", "color", "converter"],
  },

  // Image Tools
  {
    id: "image-compressor",
    title: "Image Compressor",
    slug: "image-compressor",
    description: "Compress images without losing quality",
    category: "Image",
    archetype: "file",
    featured: true,
    tags: ["image", "compression", "optimization"],
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    slug: "image-resizer",
    description: "Resize images to specific dimensions or percentages",
    category: "Image",
    archetype: "file",
    tags: ["image", "resize", "dimensions"],
  },

  // Converter Tools
  {
    id: "pdf-converter",
    title: "PDF Converter",
    slug: "pdf-converter",
    description: "Convert files to and from PDF format",
    category: "Converter",
    archetype: "file",
    tags: ["converter", "pdf", "document"],
  },
]

/**
 * Helper Functions
 */

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOL_REGISTRY.find((tool) => tool.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOL_REGISTRY.filter((tool) => tool.category === category)
}

export function getToolsByArchetype(archetype: ToolArchetype): Tool[] {
  return TOOL_REGISTRY.filter((tool) => tool.archetype === archetype)
}

export function getFeaturedTools(): Tool[] {
  return TOOL_REGISTRY.filter((tool) => tool.featured)
}

export function getAllCategories(): ToolCategory[] {
  return Array.from(new Set(TOOL_REGISTRY.map((tool) => tool.category)))
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase()
  return TOOL_REGISTRY.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}
