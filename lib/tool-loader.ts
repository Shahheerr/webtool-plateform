import { fetchAgentsList } from "./api-client"
import type { Tool, ToolArchetype, ToolCategory } from "@/constants/tool-registry"

// Re-export for convenience
export type { Tool, ToolArchetype, ToolCategory }

/**
 * Map agent/tool slug to category and archetype
 * This provides UI metadata for dynamically loaded tools
 */
function categorizeAgent(slug: string): {
    category: ToolCategory
    archetype: ToolArchetype
    description: string
    featured?: boolean
} {
    // AI Writing Tools
    if (slug.includes("story") || slug.includes("poem") || slug.includes("backstory")) {
        return {
            category: "Writing",
            archetype: "text",
            description: `Generate creative ${slug.replace(/-/g, " ")} with AI`,
            featured: slug === "story-generator",
        }
    }

    if (slug.includes("writer") || slug.includes("generator") || slug.includes("improver") || slug.includes("humanize")) {
        return {
            category: "AI",
            archetype: "text",
            description: `AI-powered ${slug.replace(/-/g, " ")} for content creation`,
            featured: slug === "ai-content-improver",
        }
    }

    if (slug.includes("checker") || slug.includes("expander") || slug.includes("shortener")) {
        return {
            category: "AI",
            archetype: "text",
            description: `Advanced ${slug.replace(/-/g, " ")} tool`,
        }
    }

    // Dev Tools
    if (slug.includes("hex") || slug.includes("rgb") || slug.includes("beautifier")) {
        return {
            category: "Dev",
            archetype: slug.includes("beautifier") ? "text" : "form",
            description: `Professional ${slug.replace(/-/g, " ")} for developers`,
            featured: slug === "code-beautifier",
        }
    }

    // SEO Tools
    if (slug.includes("domain") || slug.includes("meta") || slug.includes("seo")) {
        return {
            category: "SEO",
            archetype: "form",
            description: `Optimize your website with ${slug.replace(/-/g, " ")}`,
        }
    }

    // Catch-all
    return {
        category: "General",
        archetype: "text",
        description: `${slug.replace(/-/g, " ")} tool`,
    }
}

/**
 * Format slug to human-readable title
 */
function formatTitle(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/**
 * Load tools dynamically from FastAPI backend
 */
export async function loadToolsFromAPI(): Promise<Tool[]> {
    try {
        const { all } = await fetchAgentsList()

        return all.map((slug) => {
            const metadata = categorizeAgent(slug)

            return {
                id: slug,
                title: formatTitle(slug),
                slug,
                description: metadata.description,
                category: metadata.category,
                archetype: metadata.archetype,
                featured: metadata.featured,
                tags: slug.split("-"),
            }
        })
    } catch (error) {
        console.error("[v0] Failed to load tools from API:", error)
        // Return empty array on error - UI will handle gracefully
        return []
    }
}
