import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getToolBySlug, TOOL_REGISTRY, type Tool } from "@/constants/tool-registry"
import { loadToolsFromAPI } from "@/lib/tool-loader"
import { Header } from "@/components/header"
import { ToolPageShell } from "@/components/tool-page-shell"
import { TextTransformerUI } from "@/components/archetypes/text-transformer-ui"
import { FileProcessorUI } from "@/components/archetypes/file-processor-ui"
import { FormCalculatorUI } from "@/components/archetypes/form-calculator-ui"

// Allow dynamic slugs that aren't pre-generated at build time
export const dynamicParams = true

interface ToolPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Get tool by slug - checks static registry first, then loads from API
 */
async function getToolForPage(slug: string): Promise<Tool | undefined> {
  // First check static registry
  let tool = getToolBySlug(slug)

  if (!tool) {
    // Try loading from API
    const dynamicTools = await loadToolsFromAPI()
    tool = dynamicTools.find((t) => t.slug === slug)
  }

  return tool
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = await getToolForPage(slug)

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool could not be found",
    }
  }

  return {
    title: `${tool.title} - WebTools`,
    description: tool.description,
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = await getToolForPage(slug)

  if (!tool) {
    notFound()
  }

  // Component mapping based on archetype
  const ArchetypeComponent = {
    text: TextTransformerUI,
    file: FileProcessorUI,
    form: FormCalculatorUI,
  }[tool.archetype]

  // Safety check for archetype component
  if (!ArchetypeComponent) {
    notFound()
  }

  return (
    <div className="dark min-h-screen">
      <Header />
      <ToolPageShell tool={tool}>
        <ArchetypeComponent toolId={tool.id} toolTitle={tool.title} toolDescription={tool.description} />
      </ToolPageShell>
    </div>
  )
}

// Generate static params for all tools at build time
export async function generateStaticParams() {
  // First get static tools
  const staticSlugs = TOOL_REGISTRY.map((tool) => ({
    slug: tool.slug,
  }))

  // Try to also get dynamic tools from API
  try {
    const dynamicTools = await loadToolsFromAPI()
    const dynamicSlugs = dynamicTools.map((tool) => ({
      slug: tool.slug,
    }))

    // Combine and deduplicate
    const allSlugs = [...staticSlugs, ...dynamicSlugs]
    const uniqueSlugs = allSlugs.filter(
      (item, index, self) => self.findIndex((t) => t.slug === item.slug) === index
    )
    return uniqueSlugs
  } catch {
    // Fall back to static tools only
    return staticSlugs
  }
}

