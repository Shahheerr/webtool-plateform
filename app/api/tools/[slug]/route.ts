import { type NextRequest, NextResponse } from "next/server"

/**
 * API Route Handler for AI Agent Processing (Proxy to FastAPI Backend)
 * 
 * This route acts as a bridge between the Next.js frontend and the FastAPI backend.
 * It handles CORS, security, and forwards requests to the appropriate agent endpoint.
 * 
 * Backend Architecture:
 * - Base URL: http://127.0.0.1:8000
 * - Agent List: GET /api/v1/agents/list
 * - Agent Process: POST /api/v1/agents/process/{agent-slug}
 * 
 * Request Body (to FastAPI):
 * {
 *   "prompt": "Your prompt here",
 *   "settings": { "temperature": 0.9, "top_p": 0.9, "max_tokens": 1000 },
 *   "user_context": {}
 * }
 * 
 * Response from FastAPI:
 * {
 *   "status": "success",
 *   "agent_id": "uuid",
 *   "content": "Generated content...",
 *   "usage": null
 * }
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const contentType = request.headers.get("content-type") || ""

    // Check if this is a file upload (FormData) or JSON request
    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      console.log(`[Next.js Proxy] Handling file upload for agent: ${slug}`)

      const formData = await request.formData()

      // Forward FormData to FastAPI backend
      const response = await fetch(`${BACKEND_URL}/api/v1/agents/process/${slug}`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      console.log(`[Next.js Proxy] File upload response status: ${response.status}`)

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.detail || `Backend error: ${response.status}`,
          },
          { status: response.status }
        )
      }

      return NextResponse.json({
        success: data.status === "success",
        content: data.content,
        result: data.result,
        downloadUrl: data.download_url,
        agentId: data.agent_id,
      })
    }

    // Handle JSON request (text processing)
    const body = await request.json()

    // Build FastAPI-compatible payload
    const backendPayload = {
      prompt: body.prompt,
      settings: {
        temperature: body.settings?.temperature ?? 0.9,
        top_p: body.settings?.top_p ?? 0.9,
        max_tokens: body.settings?.max_tokens ?? 1000,
      },
      user_context: body.user_context || {},
    }

    console.log(`[Next.js Proxy] Forwarding request to agent: ${slug}`)
    console.log(`[Next.js Proxy] Payload:`, JSON.stringify(backendPayload))

    // Forward request to FastAPI backend - correct endpoint: /api/v1/agents/process/{slug}
    const response = await fetch(`${BACKEND_URL}/api/v1/agents/process/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    })

    // Parse backend response
    const data = await response.json()

    console.log(`[Next.js Proxy] Backend response status: ${response.status}`)
    console.log(`[Next.js Proxy] Backend response:`, JSON.stringify(data).slice(0, 200))

    // If backend returned an error status
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.detail || `Backend error: ${response.status}`,
        },
        { status: response.status }
      )
    }

    // FastAPI returns: { status: "success", agent_id: "...", content: "...", usage: null }
    // Frontend expects: { success: boolean, content?: string, agentId?: string, error?: string }
    const normalizedResponse = {
      success: data.status === "success",
      content: data.content,
      agentId: data.agent_id,
      usage: data.usage,
    }

    return NextResponse.json(normalizedResponse, { status: 200 })

  } catch (error) {
    console.error(`[Next.js Proxy] Error connecting to backend:`, error)

    return NextResponse.json(
      {
        success: false,
        error: "Backend connection failed. Please ensure FastAPI server is running at http://127.0.0.1:8000",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// GET handler for fetching agent info (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    // Get the list of available agents from backend
    const response = await fetch(`${BACKEND_URL}/api/v1/agents/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch agents list" },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Check if the requested slug exists
    const exists = data.all?.includes(slug) || data.agents?.includes(slug) || data.tools?.includes(slug)

    return NextResponse.json({
      slug,
      exists,
      available_agents: data.all || [],
    })

  } catch (error) {
    console.error(`[Next.js Proxy] Error fetching agents:`, error)
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    )
  }
}

