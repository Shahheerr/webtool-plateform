import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getToolBySlug } from "@/constants/tool-registry"
import { Header } from "@/components/header"
import { ToolPageShell } from "@/components/tool-page-shell"
import { TextTransformerUI } from "@/components/archetypes/text-transformer-ui"
import { FileProcessorUI } from "@/components/archetypes/file-processor-ui"
import { FormCalculatorUI } from "@/components//archetypes/form-calculator-ui"

interface ToolPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)

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
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  // Component mapping based on archetype
  const ArchetypeComponent = {
    text: TextTransformerUI,
    file: FileProcessorUI,
    form: FormCalculatorUI,
  }[tool.archetype]

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
export function generateStaticParams() {
  const { TOOL_REGISTRY } = require("@/constants/tool-registry")
  return TOOL_REGISTRY.map((tool: any) => ({
    slug: tool.slug,
  }))
}
