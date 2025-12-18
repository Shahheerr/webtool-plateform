import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ToolsGrid } from "@/components/tools-grid"
import { loadToolsFromAPI } from "@/lib/tool-loader"
import { updateToolRegistry } from "@/constants/tool-registry"

export default async function HomePage() {
  const dynamicTools = await loadToolsFromAPI()

  if (dynamicTools.length > 0) {
    updateToolRegistry(dynamicTools)
  }

  return (
    <div className="dark min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ToolsGrid tools={dynamicTools} />
      </main>
    </div>
  )
}
