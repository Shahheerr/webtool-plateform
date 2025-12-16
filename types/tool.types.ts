/**
 * Shared TypeScript Interfaces for Tool Platform
 */

export interface ToolProcessingRequest {
  toolId: string
  data: any
  options?: Record<string, any>
}

export interface ToolProcessingResponse {
  success: boolean
  data?: any
  error?: string
  processingTime?: number
}

export interface ToolUIProps {
  toolId: string
  toolTitle: string
  toolDescription: string
}

// Archetype-specific interfaces
export interface TextTransformerData {
  input: string
  options?: {
    mode?: string
    language?: string
    [key: string]: any
  }
}

export interface FileProcessorData {
  file: File
  options?: {
    quality?: number
    format?: string
    [key: string]: any
  }
}

export interface FormCalculatorData {
  fields: Record<string, string | number>
  options?: Record<string, any>
}
