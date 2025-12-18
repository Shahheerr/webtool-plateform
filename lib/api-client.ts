/**
 * FastAPI Backend Configuration
 */
const API_BASE_URL = "https://shahheerrbaba-fastapibackend.hf.space/api/v1"

/**
 * Check if we're running in the browser or on the server
 */
const isBrowser = typeof window !== "undefined"

/**
 * Request/Response Types matching FastAPI backend
 */
interface AgentProcessRequest {
  prompt: string
  settings?: {
    temperature: number
    top_p: number
    max_tokens: number
  }
  user_context?: Record<string, any>
}

interface AgentProcessResponse {
  status: string
  agent_id: string
  content: string
  usage: any | null
}

interface AgentListResponse {
  agents: string[]
  tools: string[]
  all: string[]
}

/**
 * Fetch available agents/tools from backend
 * This is called server-side, so we call FastAPI directly
 */
export async function fetchAgentsList(): Promise<AgentListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/agents/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Add cache revalidation for Next.js
      next: { revalidate: 60 },
    } as RequestInit)

    if (!response.ok) {
      throw new Error(`Failed to fetch agents list: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[API Client] Failed to fetch agents list:", error)
    throw error
  }
}

/**
 * Process agent/tool request
 * - On browser: Uses Next.js API proxy to avoid CORS issues
 * - On server: Calls FastAPI directly
 * 
 * @param slug - Agent/tool identifier (e.g., "story-generator")
 * @param prompt - User input prompt
 * @param settings - Optional AI settings (temperature, top_p, max_tokens)
 */
export async function processAgentRequest(
  slug: string,
  prompt: string,
  settings?: {
    temperature?: number
    top_p?: number
    max_tokens?: number
  },
): Promise<{
  success: boolean
  content?: string
  agentId?: string
  error?: string
}> {
  try {
    // Build request body
    const requestBody: AgentProcessRequest = {
      prompt,
      settings: {
        temperature: settings?.temperature ?? 0.9,
        top_p: settings?.top_p ?? 0.9,
        max_tokens: settings?.max_tokens ?? 1000,
      },
      user_context: {},
    }

    console.log(`[API Client] Processing agent request: ${slug}`)

    // Determine endpoint based on environment
    // Browser: Use Next.js proxy to avoid CORS
    // Server: Call FastAPI directly
    const endpoint = isBrowser
      ? `/api/tools/${slug}`
      : `${API_BASE_URL}/agents/process/${slug}`

    console.log(`[API Client] Using endpoint: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.detail || `Request failed with status ${response.status}`)
    }

    const data = await response.json()

    console.log(`[API Client] Response received:`, data.success ? "success" : "failed")

    // Handle response format differences
    // Next.js proxy returns: { success, content, agentId }
    // FastAPI returns: { status, content, agent_id }
    if (isBrowser) {
      // Response from Next.js proxy
      return {
        success: data.success,
        content: data.content,
        agentId: data.agentId,
        error: data.error,
      }
    } else {
      // Response from FastAPI directly
      return {
        success: data.status === "success",
        content: data.content,
        agentId: data.agent_id,
      }
    }
  } catch (error) {
    console.error("[API Client] Agent processing error:", error)

    // User-friendly error messages
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Backend Connection Error: Could not connect to the server. Please ensure your FastAPI server is running at http://127.0.0.1:8000",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Process file upload to FastAPI backend
 * For tools that accept file inputs
 */
export async function processFileRequest(
  slug: string,
  file: File,
): Promise<{
  success: boolean
  response?: string
  downloadUrl?: string
  error?: string
}> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    console.log(`[API Client] Processing file request: ${slug}`)

    // Use Next.js proxy for browser requests
    const endpoint = isBrowser
      ? `/api/tools/${slug}`
      : `${API_BASE_URL}/agents/process/${slug}`

    console.log(`[API Client] Using file upload endpoint: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || errorData.detail || `Backend responded with status ${response.status}`)
    }

    const data = await response.json()

    return {
      success: data.success !== false,
      response: data.content || data.result || data.response,
      downloadUrl: data.download_url || data.downloadUrl,
    }
  } catch (error) {
    console.error("[API Client] File upload error:", error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Backend Connection Error: Could not connect to the server. Please ensure your FastAPI server is running at http://127.0.0.1:8000",
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "File processing failed",
    }
  }
}

