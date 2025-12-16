/**
 * Tool Utility Functions
 * Helper functions for tool operations and validations
 */

import type { ToolArchetype } from "@/constants/tool-registry"

export function getArchetypeComponentName(archetype: ToolArchetype): string {
  const componentMap: Record<ToolArchetype, string> = {
    text: "TextTransformerUI",
    file: "FileProcessorUI",
    form: "FormCalculatorUI",
  }
  return componentMap[archetype]
}

export function validateToolData(data: any, archetype: ToolArchetype): boolean {
  switch (archetype) {
    case "text":
      return typeof data.input === "string" && data.input.length > 0
    case "file":
      return data.file instanceof File
    case "form":
      return typeof data.fields === "object" && Object.keys(data.fields).length > 0
    default:
      return false
  }
}

export function formatToolResponse(data: any): string {
  if (typeof data === "string") return data
  if (typeof data === "object") return JSON.stringify(data, null, 2)
  return String(data)
}

export async function simulateProcessing(duration = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}
