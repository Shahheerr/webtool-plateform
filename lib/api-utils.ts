/**
 * API Utility Functions
 * Helper functions for API operations
 */

import type { ToolProcessingRequest, ToolProcessingResponse } from "@/types/tool.types"

/**
 * Validate tool processing request
 */
export function validateToolRequest(body: ToolProcessingRequest): { valid: boolean; error?: string } {
  if (!body.toolId) {
    return { valid: false, error: "Tool ID is required" }
  }

  if (!body.data) {
    return { valid: false, error: "Data is required" }
  }

  return { valid: true }
}

/**
 * Create success response
 */
export function createSuccessResponse(data: any, processingTime?: number): ToolProcessingResponse {
  return {
    success: true,
    data,
    processingTime,
  }
}

/**
 * Create error response
 */
export function createErrorResponse(error: string): ToolProcessingResponse {
  return {
    success: false,
    error,
  }
}

/**
 * Format file size for display
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * Generate mock file URL
 * In production, replace with actual file storage (Vercel Blob, S3, etc.)
 */
export function generateMockFileUrl(filename: string): string {
  return `/api/files/download/${encodeURIComponent(filename)}`
}
